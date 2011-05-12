package edu.ucar.metviewer;

import java.awt.*;
import java.sql.*;
import java.util.*;
import java.util.regex.*;
import java.text.*;
import java.io.*;

public class MVUtil{
	
	public static PrintStream _out = System.out;
	
	public static final double INVALID_DATA = -9999;
	
	public static final Pattern _patProb		= Pattern.compile("PROB\\(([\\w\\d]+)([<>=]+)([^\\)]+)\\)");

	public static String getSQLDateFormat(String field){ return "DATE_FORMAT(" + field + ", '%Y-%m-%d %H:%i:%s')"; }
	
	/**
	 * Parse the database URL stored in the input Connection meta data and return the name of the database,
	 * which should occur as the last alpha numeric string in the URL after the final slash (/).
	 * @param con Connection whose database name to parse and return
	 * @return database name
	 * @throws Exception
	 */
	public static String getDBName(Connection con) throws Exception{
		String strURL = con.getMetaData().getURL();		
		Matcher mat = Pattern.compile("/(\\w+)$").matcher(strURL);
		String strDB = "";
		if( mat.find() ){ strDB = mat.group(1); }
		return strDB;
	}
	
	/**
	 * Format the input field according to the table that it is stored in, and whether or not it needs
	 * to be derived or formatted as a date.  Stat fields must be differentiated from MODE fields.  Also,
	 * fields intended for the select list, as opposed to a where clause, must be specified.
	 * @param field MET output header field to format
	 * @param mode specifies whether or not the field is a stat_header or mode_header field
	 * @param fmtSel specifies whether the formatted field will be used for the select list (true) or 
	 * a where clause (false)
	 * @return the formatted field
	 */
	public static String formatField(String field, boolean mode, boolean fmtSel){
		if     ( field.equals("init_hour") )                { return (mode? "HOUR(h.fcst_init)"  : "HOUR(ld.fcst_init_beg)")  + (fmtSel? " init_hour" : "");  }
		else if( field.equals("valid_hour") )               { return (mode? "HOUR(h.fcst_valid)" : "HOUR(ld.fcst_valid_beg)") + (fmtSel? " valid_hour" : ""); }
		else if( field.equals("fcst_init")      &&  fmtSel ){ return getSQLDateFormat("h.fcst_init") + " fcst_init";            }
		else if( field.equals("fcst_init_beg")  &&  fmtSel ){ return getSQLDateFormat("ld.fcst_init_beg") + " fcst_init_beg";   }
		else if( field.equals("fcst_init_beg")  && !fmtSel ){ return "ld.fcst_init_beg";                                        }
		else if( field.equals("fcst_valid")     &&  fmtSel ){ return getSQLDateFormat("h.fcst_valid") + " fcst_valid";          }
		else if( field.equals("fcst_valid_beg") &&  fmtSel ){ return getSQLDateFormat("ld.fcst_valid_beg") + " fcst_valid_beg"; }
		else if( field.equals("fcst_valid_beg") && !fmtSel ){ return "ld.fcst_valid_beg";                                       }
		else if( field.equals("fcst_lead") )                { return (mode? "h.fcst_lead" : "ld.fcst_lead");                    }
		else                                                { return "h." + field;                                              }
	}
	public static String formatField(String field, boolean mode){ return formatField(field, mode, true); }

	/**
	 * Query the database for a list of all ordered distinct fcst_init_begs and return them for use as 
	 * an aggregate value list.  If a date range is desired, specify either or both the begin and
	 * end dates in the SQL format YYYY-MM-dd HH:mm:ss.  
	 * @param con database connection to use for query
	 * @param begin database field name for date of interest, for example fcst_valid_beg or fcst_init_beg
	 * @param begin optional begin date for list
	 * @param end optional end date for list
	 * @param hour optional 24-hour clock hour value for restricting the search
	 * @return list containing the requested dates in SQL format
	 */
	public static String[] buildDateAggList(Connection con, String field, String begin, String end, String hour){
		ArrayList listDates = new ArrayList();
		try{
			String strWhere = "";
			if( (null != begin && !begin.equals("")) && (null != end && !end.equals("")) ){
				strWhere = "WHERE " + field + " BETWEEN '" + begin + "' AND '" + end + "' ";
			} else if( null != begin && !begin.equals("") ) {
				strWhere = "WHERE " + field + " >= '" + begin + "' ";
			} else if( null != end && !end.equals("") ){
				strWhere = "WHERE " + field + " <= '" + end + "' ";
			}
			
			if( null != hour && !hour.equals("") ){
				strWhere += ( strWhere.equals("") ? "WHERE" : "AND" ) + " HOUR(" + field + ") = '" + hour + "' "; 
			}
			
			Statement stmt = con.createStatement();
			String strTable = (field.equalsIgnoreCase("fcst_valid") || field.equalsIgnoreCase("fcst_init")? "mode_header" : "stat_header");
			ResultSet res = stmt.executeQuery("SELECT DISTINCT " + getSQLDateFormat(field) + "FROM " + strTable + " " + strWhere + "ORDER BY " + field);
			for(int i=0; res.next(); i++){ listDates.add( res.getString(1) ); }
			stmt.close();
		} catch (Exception e) {
			System.err.println("  **  ERROR: caught " + e.getClass() + " in buildDateAggList(): " + e.getMessage());
			e.printStackTrace();
		}
		return (String[])listDates.toArray(new String[]{});
	}
	public static String[] buildDateAggList(Connection con, String field, String begin, String end){ return buildDateAggList(con, field, begin, end, "");   }
	public static String[] buildDateAggList(Connection con, String field, String inithour)         { return buildDateAggList(con, field, "", "", inithour); }
	public static String[] buildDateAggList(Connection con, String field)                          { return buildDateAggList(con, field, "", "", "");       }

	/**
	 * Build a list of strings representing consecutive dates between the input dates start and
	 * end, incrementing by incr number of seconds.  It is assumed that the format of start and
	 * end is given by the java date format string format.  The output dates will have the same
	 * format. 
	 * @param start Beginning date, given in the format specified by the format input
	 * @param end End date, given in the format specified by the format input
	 * @param incr Number of seconds to increment between successive dates in the list
	 * @param format Java date format string, describing input and output dates
	 * @return List of date strings
	 */
	public static String[] buildDateList(String start, String end, int incr, String format){
		SimpleDateFormat formatDate = new SimpleDateFormat(format);
		formatDate.setTimeZone(TimeZone.getTimeZone("UTC"));
		ArrayList listDates = new ArrayList();
		
		try{
			java.util.Date dateStart = formatDate.parse(start);
			java.util.Date dateEnd = formatDate.parse(end);
			Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"));			
			cal.setTime(dateStart);
			
			while( (incr > 0 && cal.getTime().getTime() <= dateEnd.getTime()) ||
				   (incr < 0 && cal.getTime().getTime() >= dateEnd.getTime()) ){
				listDates.add( formatDate.format(cal.getTime()) );
				cal.add(Calendar.SECOND, incr);
			}
		
		}catch(Exception e){
			_out.println("  **  ERROR: caught " + e.getClass() + " in buildDateList(): " + e.getMessage());
		}
		return (String[])listDates.toArray(new String[]{});
	}
	
	/**
	 * Build a String representation of the date specified by the input <date_offset> {@link MVNode}.  The offset
	 * is taken either from the current date (default) or from the date specified by the input date.
	 * @param node MVNode structure specifying the offset
	 * @param format (optional) String representation of the input/output date formats
	 * @param date (optional) String representation of the date from which to offset
	 * @return String representation of the offset date
	 */
	public static String parseDateOffset(MVNode node, String format, String date){
		int intOffset = 0;
		int intHour = 0;
		
		for(int i=0; i < node._children.length; i++){
			MVNode nodeChild = node._children[i];
			if     ( nodeChild._tag.equals("day_offset") ){ intOffset = Integer.parseInt(nodeChild._value); }
			else if( nodeChild._tag.equals("hour")       ){ intHour   = Integer.parseInt(nodeChild._value); }
		}
		
		SimpleDateFormat formatOffset = new SimpleDateFormat(format);
		formatOffset.setTimeZone(TimeZone.getTimeZone("UTC"));
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
		try{
			cal.setTime( formatOffset.parse(date) );
		} catch(Exception e){}
		cal.set(Calendar.HOUR_OF_DAY, intHour);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.add(Calendar.DATE, intOffset);
		
		return formatOffset.format(cal.getTime());
	}
	public static String parseDateOffset(MVNode node, String format){ return parseDateOffset(node, format, null); }
	public static String parseDateOffset(MVNode node){ return parseDateOffset(node, "yyyy-MM-dd", null); }
	
	public static void main(String[] argv){
		try{
			
			java.sql.Date date = new java.sql.Date( _formatDB.parse("2010-06-12 12:00:00").getTime() );
			java.sql.Date start = new java.sql.Date( _formatDB.parse("2009-06-01 00:00:00").getTime() );			
			buildDateKey(date, start, 1, "361015", 999999, 1, 1, 1);
			
		} catch(Exception e){}
	}
	
	public static String buildDateKey(java.sql.Date date, java.sql.Date start, int dateWidth, String lead, int hdrId, int hdrIdWidth, int alpha, int covThresh){

		/*
		//  with seconds
		long intTime = date.getTime();
		long intStart = start.getTime();
		long intDiff = (date.getTime() - start.getTime()) / 1000;
		String strDate = padBegin("" + intDiff, "0", dateWidth);
		String strLead = "" + lead;
		int intLeadSec = Integer.parseInt( strLead.substring(strLead.length() - 2) );
		int intLeadMin = Integer.parseInt( strLead.substring(strLead.length() - 4, strLead.length() - 2) );
		int intLeadHr  = Integer.parseInt( strLead.substring(0, strLead.length() - 4) );
		int intLead = (intLeadHr * 3600 + intLeadMin * 60 + intLeadSec);
		strLead = padBegin("" + intLead, "0", 6);
		String strId = padBegin("" + hdrId, "0", hdrIdWidth);
		*/
		
		//  with minutes
		long intTime = date.getTime();
		long intStart = start.getTime();
		long intDiff = (date.getTime() - start.getTime()) / 60000;
		String strDate = padBegin("" + intDiff, "0", dateWidth);
		String strLead = "" + lead;
		int intLeadSec = Integer.parseInt( strLead.substring(strLead.length() - 2) );
		int intLeadMin = Integer.parseInt( strLead.substring(strLead.length() - 4, strLead.length() - 2) );
		int intLeadHr  = Integer.parseInt( strLead.substring(0, strLead.length() - 4) );
		int intLead = (intLeadHr * 60 + intLeadMin);
		strLead = padBegin("" + intLead, "0", 4);
		String strId = padBegin("" + hdrId, "0", hdrIdWidth);
		
		String strRet = "" + intDiff + strLead + strId + alpha + covThresh;
		int intRetLen = strRet.length();
		return strRet;
	}
	
	/**
	 * Returns the difference between the two dates in the specified units.  The acceptible units values
	 * are 0 (milliseconds), 1 (seconds), 2 (minutes), 3 (hours) or 4 (days).  The returned result is 
	 * the truncated value (floor).
	 * @param date1 the date that will be subtracted from
	 * @param date2 the date that will be subtracted
	 * @param units specifies the units of the returned value (0-4), 0 is default
	 * @return difference between input dates in the specified units
	 */
	public static long dateDiff(java.sql.Date date1, java.sql.Date date2, int units){
		int intDiv = 1;
		switch(units){
		case 1:		intDiv = 1000;		break;
		case 2:		intDiv = 60000;		break;
		case 3:		intDiv = 3600000;	break;
		case 4:		intDiv = 86400000;	break;
		}
		return (date1.getTime() - date2.getTime()) / intDiv;
	}
	
	/**
	 * Concatenate the elements of the input list with surrounding ticks and separated by commas for
	 * use in the where clause of a SQL query.  For example, the function call  
	 * <code>buildValueList(new String[]{"a", "bb", "c"})</code> will return the string 
	 * "'a', 'bb', 'c'".
	 * @param values The list of values to be concatenated
	 * @return The string of concatenated values for use in a SQL where clause
	 */
	public static String buildValueList(String[] values){
		String strValueList = "";		
		for(int i=0; null != values && i < values.length; i++){
			strValueList += (0 < i? ", " : "") + "'" + values[i] + "'";
		}
		return strValueList;
	}
	
	/**
	 * Create a {@link MVDataTable} whose fields are the keys of the input table and whose rows 
	 * represent every permutation of the values stored in the input table.  It is assumed that
	 * the table contains a mapping from String to String[].  If the input table is an 
	 * {@link MVOrderedMap}, the fields of the output MVDataTable are ordered in the same order as 
	 * the keys of the input.      
	 * @param table Contains key/value pairs of String/String[] which will be permuted
	 * @return MVDataTable whose rows are the permutations
	 */
	public static MVDataTable permute(MVOrderedMap table){
		
		if( null == table || 1 > table.size() ){ return new MVDataTable(); }
		
		//  use the ordered list of table entries, if appropriate
		Map.Entry[] listVals = {};
		listVals = ((MVOrderedMap)table).getOrderedEntries();
		
		//  if the input table contains a single value, build and return the simplest table
		if( 1 == listVals.length ){
			MVDataTable dtRet = new MVDataTable();
			String strField = (String)listVals[0].getKey(); 
			Object objVal = listVals[0].getValue();

			//  handle simple field value lists
			if( objVal instanceof String[] ){
				dtRet.addField(strField);
				String[] listVal = (String[])listVals[0].getValue();
				for(int i=0; i < listVal.length; i++){
					MVOrderedMap tableRow = new MVOrderedMap();
					tableRow.put(strField, listVal[i]);
					dtRet.addRow(tableRow);
				}
			
			//  handle field value sets
			} else if( objVal instanceof MVOrderedMap ){
				dtRet.addField(strField + "_set");
				Map.Entry[] listValSet = ((MVOrderedMap)objVal).getOrderedEntries();
				for(int i=0; i < listValSet.length; i++){
					MVOrderedMap tableRow = new MVOrderedMap();
					tableRow.put(strField + "_set", listValSet[i].getKey());
					dtRet.addRow(tableRow);
				}
			}
			return dtRet;
		}
		
		//  if the input table contains more than one value, build the sub-table first
		String strField = (String)listVals[0].getKey();
		MVOrderedMap tableSub = new MVOrderedMap(table);
		tableSub.remove(strField);
		MVDataTable dtSub = permute(tableSub);
		
		//  build a new table with one copy of the sub-table for each value of the current field
		MVOrderedMap[] listRows = dtSub.getRows();
		MVDataTable dtRet = new MVDataTable(dtSub.getFields());
		Object objVal = listVals[0].getValue();
		
		//  handle simple field value lists
		if( objVal instanceof String[] ){
			dtRet.addField(strField, "", 0);
			String[] listVal = (String[])listVals[0].getValue();
			for(int i=0; i < listVal.length; i++){
				for(int j=0; j < listRows.length; j++){
					MVOrderedMap tableRow = new MVOrderedMap(listRows[j]);
					tableRow.put(strField, listVal[i]);
					dtRet.addRow(tableRow);
				}
			}
			
		//  handle field value sets
		} else if( objVal instanceof MVOrderedMap ){
			dtRet.addField(strField + "_set", "", 0);
			Map.Entry[] listValSet = ((MVOrderedMap)objVal).getOrderedEntries();
			for(int i=0; i < listValSet.length; i++){
				for(int j=0; j < listRows.length; j++){
					MVOrderedMap tableRow = new MVOrderedMap(listRows[j]);
					tableRow.put(strField + "_set", listValSet[i].getKey());
					dtRet.addRow(tableRow);
				}
			}
		}

		return dtRet;
	}
	
	public static SimpleDateFormat _formatDB = null;
	public static SimpleDateFormat _formatDBms = null;
	public static SimpleDateFormat _formatPlot = null;
	public static SimpleDateFormat _formatStat = null;
	public static SimpleDateFormat _formatFcstLead = null;
	public static SimpleDateFormat _formatBase = null;
	public static SimpleDateFormat _formatDate = null;
	static{
		try{ _formatDB = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");		_formatDB.setTimeZone(TimeZone.getTimeZone("UTC"));			}catch(Exception e){}
		try{ _formatDBms = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");	_formatDBms.setTimeZone(TimeZone.getTimeZone("UTC"));		}catch(Exception e){}
		try{ _formatPlot = new SimpleDateFormat("yyyyMMddHH");				_formatPlot.setTimeZone(TimeZone.getTimeZone("UTC"));		}catch(Exception e){}
		try{ _formatStat = new SimpleDateFormat("yyyyMMdd_HHmmss");			_formatStat.setTimeZone(TimeZone.getTimeZone("UTC"));		}catch(Exception e){}
		try{ _formatFcstLead = new SimpleDateFormat("HHmmss");				_formatFcstLead.setTimeZone(TimeZone.getTimeZone("UTC"));	}catch(Exception e){}
		try{ _formatBase = new SimpleDateFormat("yyyyMMdd'b'");				_formatBase.setTimeZone(TimeZone.getTimeZone("UTC"));		}catch(Exception e){}
		try{ _formatDate = new SimpleDateFormat("yyyyMMdd");				_formatDate.setTimeZone(TimeZone.getTimeZone("UTC"));		}catch(Exception e){}
	}
	
	/**
	 * Populate a template string, specified by tmpl, with values specified in the input map vals.  If
	 * a template tag is not found in the input vals table, a warning is printed and the tag is passed
	 * through to the output.  
	 * @param tmpl Template String containing tags with format <tag_name>
	 * @param vals Contains a mapping from tag names to values
	 * @param tmplMaps Map of value maps for each template field, used with map template parm (optional) 
	 * @return String built using the template and values
	 */
	public static String buildTemplateString(String tmpl, MVOrderedMap vals, MVOrderedMap tmplMaps){
		
		
		String strRet = new String(tmpl);
		Matcher matTmpl = _patPlotTmpl.matcher(tmpl);
		while( matTmpl.find() ){			
			String strTmplTag = matTmpl.group(1);
			String strTmplTagName = matTmpl.group(2);
			
			MVOrderedMap mapParms = parseTagParams(strTmplTag);
			//String strVal = ((String)vals.get(strTmplTagName)).replace(" ", "_");
			if( strTmplTagName.equals("date") ){
				vals.put("date", _formatDate.format(new java.util.Date()));				
			}
			
			if( !vals.containsKey(strTmplTagName) ){
				_out.println("  **  WARNING: template tag " + strTmplTagName + " not found in agg perm");
				continue;
			}

			String strVal = ((String)vals.get(strTmplTagName));			
			
			//  if there is a corresponding tag value map, use the map value			
			if( mapParms.containsKey("map") ){
				String strMapName = mapParms.get("map").toString();
				if( strMapName.equalsIgnoreCase("true") ){
					strMapName = strTmplTagName;
				}
				MVOrderedMap mapTmplVal = (MVOrderedMap)tmplMaps.get(strMapName);
				strVal = (mapTmplVal.containsKey(strVal)? mapTmplVal.getStr(strVal) : strVal);
			}
				
			//  if there is a format parameter, apply it to the value
			if( mapParms.containsKey("format") ){
				String strFormat = mapParms.getStr("format");
				
				if( strTmplTagName.equals("fcst_lead") ){
					if( strVal.equals("0") )          { strVal = "00000";                                  }
					if( strFormat.equals("HH") )      { strVal = strVal.substring(0, strVal.length() - 4); }
					if( strFormat.equals("HHmm") )    { strVal = strVal.substring(0, strVal.length() - 2); }
					while( strFormat.length() > strVal.length() ){ strVal = "0" + strVal; }

				} else if( strTmplTagName.equals("init_hour") || strTmplTagName.equals("valid_hour") ){
					if( strFormat.equals("HH") ){		while(2 > strVal.length()){ strVal = "0" + strVal; }	}					
				}
				
				if( mapParms.getStr("format").equalsIgnoreCase("R") ){
					strVal = formatR(strVal);
				}
			}
			
			//  if the tag value is a date, format it accordingly
			java.util.Date dateParse = null;
			try{
				if( null != (dateParse = _formatDB.parse(strVal)) || null != (dateParse = _formatDBms.parse(strVal)) ){
					strVal = _formatPlot.format(dateParse);
				}
			}catch(Exception e){}
			
			//  if the tag is a threshold, format it accordingly
			if( strTmplTagName.equals("fcst_thresh") || strTmplTagName.equals("fcst_thr") ||
				strTmplTagName.equals("obs_thresh")  || strTmplTagName.equals("obs_thr") ){
				strVal = formatThresh(strTmplTag, strVal);
			}
			
			strRet = strRet.replace("{" + strTmplTag + "}", strVal);
		}
		return strRet;
	}
	public static String buildTemplateString(String tmpl, MVOrderedMap vals){ return buildTemplateString(tmpl, vals, null); }
	
	public static final Pattern _patPlotTmpl	= Pattern.compile("\\{((\\w+)(?:\\?[^}]*)?)\\}");
	
	/**
	 * Reformat the fcst_thresh value using the directions provided in the body of the template
	 * tag.  It is assumed that the input template tag has the parameterized tag format:
	 *   
	 *   <i>fcst_thresh?param1=val1;param2=val2[;...]  where the params can be the following:</i>
	 *   <ul>
	 *   <li><b>units</b> set to either mm or in (input assumed to be in mm) 
	 *   <li><b>format</b> set to the java formatting string to apply, for example 0.00# 
	 *   <li><b>symbol</b> set to either letters or math, for example ge or >=, respectively
	 *   </ul> 
	 * 
	 * @param fcstTag Template tag name (including params) for fcst_thresh
	 * @param fcstThresh Template map value to be formatted
	 * @return
	 */
	public static String formatThresh(String fcstTag, String fcstThresh){
		String strThreshRet = fcstThresh;
		MVOrderedMap mapParams = parseTagParams(fcstTag);
		DecimalFormat format = new DecimalFormat("0.000");

		//  attempt to parse the input threshold
		String strSymbol = "", strThresh = "";
		double dblThresh = -1.0;
		Matcher matFcstThresh = _patThresh.matcher(fcstThresh);
		if( matFcstThresh.matches() ){
			strSymbol = matFcstThresh.group(1);
			strThresh = matFcstThresh.group(2);
			dblThresh = Double.parseDouble(strThresh);
		} else {
			_out.println("  **  WARNING: threshhold " + fcstThresh + " not matched");
			return strThreshRet;
		}
		
		//  change the units, if requested
		if( mapParams.containsKey("units") ){
			String strUnits = mapParams.get("units").toString();
			if( strUnits.equals("in") ){
				strThresh = format.format( dblThresh /= 25.4 );
				strThreshRet = strSymbol + strThresh;						
			}
		}
		
		//  change the format, if requested
		if( mapParams.containsKey("format") ){
			String strFormat = mapParams.get("format").toString();
			strThresh = (new DecimalFormat(strFormat)).format(dblThresh);
			strThreshRet = strSymbol + strThresh;			
		}
		
		//  change the logic symbol, if requested
		if( mapParams.containsKey("symbol") ){
			String strSymbolType = mapParams.get("symbol").toString();
			if( strSymbolType.equals("letters") ){
				strSymbol = strSymbol.replace("==", "eq")
									 .replace("!=", "ne")
									 .replace("<=", "le")
									 .replace(">=", "ge")
									 .replace("<",  "lt")
									 .replace(">",  "gt");
				strThreshRet = strSymbol + strThresh;
			}
		}
		
		return strThreshRet;
	}
	
	/**
	 * Sort the list of input thresholds, according to the numeric threshold value. 
	 * @param thresh List of thresholds
	 * @param asc true for ascending order
	 * @return Sorted threshold list, by value
	 */
	public static final String[] sortThresh(String[] thresh){
		return sortVals(thresh, true, _patThresh);
	}
	
	public static final Pattern _patThresh = Pattern.compile("([<>=!]{1,2})(\\d*(?:\\.\\d+)?)");
	
	/**
	 * Sort the list of input levels, according to the first numeric level value. 
	 * @param thresh List of thresholds
	 * @param asc true for ascending order
	 * @return Sorted threshold list, by value
	 */
	public static final String[] sortLev(String[] lev){
		return sortVals(lev, true, _patLev);
	}
	
	/**
	 * Sort the input list of values by parsing them with the input pattern and sort them according
	 * to the numerical portion (assumed to be group 2 of the matched pattern).
	 * @param vals List of String representations of the values
	 * @param asc true for ascending order
	 * @param pat Pattern used to parse the input values
	 * @return Sorted list, by numerical value
	 */
	public static final String[] sortVals(String[] vals, boolean asc, Pattern pat){
		
		//  parse the input values and store the numerical values in a sortable array
		double[] listVal = new double[vals.length];		
		Hashtable tableVal = new Hashtable();
		double dblInvalid = -.00001;
		for(int i=0; i < vals.length; i++){
			
			//  apply the pattern to the value
			double dblVal = 0;
			Matcher mat = pat.matcher(vals[i]);
			
			//  if the value matches, parse out the numerical value 
			if( mat.matches() ){
				dblVal = Double.parseDouble(mat.group(2));
				if( 3 == mat.groupCount() && null != mat.group(3) ){
					dblVal = (dblVal + Double.parseDouble(mat.group(3))) / 2;
				}
			} 
			
			//  otherwise, use the literal value with a default numerical value
			else {
				dblVal = dblInvalid;
				dblInvalid -= .00001;
				_out.println("  **  WARNING: sortVals() could not parse value " + vals[i]);
			}
			
			//  verify and store the numerical value and the value pair
			listVal[i] = dblVal;
			Double dblKey = new Double(listVal[i]);
			Object objVal = vals[i];
			if( tableVal.containsKey(dblKey) ){
				Object objValCur = tableVal.get(dblKey);
				ArrayList listValCur = new ArrayList();
				if( objValCur instanceof String ){
					listValCur.add(objValCur);
					listValCur.add(vals[i]);					
				} else {
					((ArrayList)objValCur).add(vals[i]);
				}
				objVal = listValCur;
			}
			tableVal.put(new Double(listVal[i]), objVal);
		}
		
		//  sort the numerical values and build a sorted list of values
		Arrays.sort(listVal);
		ArrayList listRet = new ArrayList();
		Hashtable tableAdded = new Hashtable();
		for(int i=0; i < listVal.length; i++){
			
			//  verify that the values have not already been added
			Double dblKey = new Double(listVal[i]);
			if( tableAdded.containsKey(dblKey) ){ continue; } 

			//  if not, add the value(s) to the return list
			Object objValCur = tableVal.get( dblKey );
			if( objValCur instanceof String ){
				listRet.add(asc? listRet.size() : 0, objValCur);
			} else {
				ArrayList listValCur = (ArrayList)objValCur;
				for(int j=0; j < listValCur.size(); j++){
					listRet.add(asc? listRet.size() : 0, listValCur.get(j));
				}
			}
			tableAdded.put(dblKey, "true");
		}
		
		return (String[])listRet.toArray(new String[]{});
	}

	public static final Pattern _patLev = Pattern.compile("(\\w)(\\d+)(?:-(\\d+))?");
	
	/**
	 * Parse, format and sort the input list of lead times, removing the trailing 0000, if requested.
	 * @param lead List of lead time values
	 * @param asc true for ascending order
	 * @param removeZeros true to remove the trailing 0000 from the lead time value
	 * @return Sorted list of formatted lead times, by numerical value
	 */
	public static final String[] sortFormatLead(String[] lead, boolean asc, boolean removeZeros){
		
		//  parse and format the leads and store the numerical values in a sortable array
		double[] listVal = new double[lead.length];		
		Hashtable tableVal = new Hashtable();
		for(int i=0; i < lead.length; i++){
			listVal[i] = Double.parseDouble(lead[i]);
			String strLead = lead[i];
			if( removeZeros && strLead.endsWith("0000") ){ strLead = strLead.replaceAll("0000$", ""); }
			tableVal.put(new Double(listVal[i]), strLead);
		}
		
		//  sort the lead numerical values and build a sorted list of leads
		Arrays.sort(listVal);		
		String[] listRet = new String[lead.length];
		for(int i=0; i < listVal.length; i++){
			listRet[asc? i : listVal.length - 1 - i] = tableVal.get( new Double(listVal[i]) ).toString();			
		}
		
		return listRet;
	}
	
	public static final String[] sortHour(String[] hour, boolean asc){
		
		//  parse and format the hours and store the numerical values in a sortable array
		double[] listVal = new double[hour.length];		
		Hashtable tableVal = new Hashtable();
		for(int i=0; i < hour.length; i++){
			listVal[i] = Double.parseDouble(hour[i]);
			String strHour = hour[i];
			while( strHour.length() < 2 ){ strHour = "0" + strHour; }
			tableVal.put(new Double(listVal[i]), strHour);
		}
		
		//  sort the lead numerical values and build a sorted list of leads
		Arrays.sort(listVal);		
		String[] listRet = new String[hour.length];
		for(int i=0; i < listVal.length; i++){
			listRet[asc? i : listVal.length - 1 - i] = tableVal.get( new Double(listVal[i]) ).toString();			
		}
		
		return listRet;
	}
	
	/**
	 * Parse template tag parameter pairs and return them in an ordered map.  For example,
	 * <i>parseTagParams("tag_name?param1=val1;param2=val2")</i> returns a map with two 
	 * members, param1 and param2 with their values set accordingly.
	 * @param tag Formatted tag with param/value pairs to parse
	 * @return Ordered map containing parsed param/value pairs
	 */
	public static MVOrderedMap parseTagParams(String tag){
		MVOrderedMap mapRet = new MVOrderedMap();
		Matcher mat = _patTag.matcher(tag);
		if( mat.matches() && null != mat.group(2) ){
			String[] listPairs = mat.group(2).split("\\s*&\\s*");
			for(int i=0; i < listPairs.length; i++){
				String[] listPair = listPairs[i].split("\\s*=\\s*");
				mapRet.put(listPair[0], listPair[1]);
			}
		}

		return mapRet;
	}
	public static final Pattern _patTag = Pattern.compile("([\\w\\d]+)(?:\\s*\\?(.*))?");	
	
	/**
	 * Pads input str with spaces appended to the end so that the length of the returned String is 
	 * at least width characters
	 * @param str The string to pad
	 * @param width The minimum number of characters in the returned String 
	 * @return the padded version of the input str
	 */
	public static String padEnd(String str, String pad, int width){
		while( width > str.length() ) str += pad;
		return str;
	}
	public static String padEnd(String str, int width){ return padEnd(str, " ", width); }
	public static String padEnd(String str)           { return padEnd(str, 16); }
	
	/**
	 * Pads input str with spaces appended to the beginning so that the length of the returned String 
	 * is at least width characters
	 * @param str The string to pad
	 * @param width The minimum number of characters in the returned String 
	 * @return the padded version of the input str
	 */
	public static String padBegin(String str, String pad, int width){
		while( width > str.length() ) str = pad + str;
		return str;
	}
	public static String padBegin(String str, int width){ return padBegin(str, " ", width); }
	public static String padBegin(String str)           { return padBegin(str, 16); }
	
	/**
	 * Create a string representation for the input time span, which should represent milliseconds
	 * between events.  For example, a time span message can be generated as follows:
	 * <code>formatTimeStamp(dateEnd.getTime() - dateStart.getTime())</code>
	 * @param span Time span, in milliseconds
	 * @return Time span in format [days]d H:mm:ss.mmmm
	 */
	public static String formatTimeSpan(long span){
		long intDay	= span / (24l * 60l * 60l * 1000l);
		span		-= intDay * 24l * 60l * 60l * 1000l;
		long intHr	= span / (60l * 60l * 1000l);
		span		-= intHr * 60l * 60l * 1000l;
		long intMin	= span / (60l * 1000l);
		span		-= intMin * 60l * 1000l;
		long intSec	= span / 1000l;
		span		-= intSec * 1000l;
		long intMS	= span;
				
		return (0 < intDay? "" + intDay + "d " : "") +	"" + intHr + 
			   (10 > intMin? ":0" : ":") + intMin + (10 > intSec? ":0" : ":") + intSec + "." +
			   (100 > intMS? "0" + (10 > intMS? "0" : "") : "") + intMS;						
	}
	
	/**
	 * Generate a list of ARGB hex color strings which sample the "rainbow" color continuum at the
	 * requested number of point in the direction of red to violet.  Mimics the R function of the
	 * same name. 
	 * @param num The number of samples on the rainbow continuum to generate
	 * @return The list of color hex strings
	 */
	public static String[] rainbow(int num){
		if( 1 > num )	{ return new String[]{};			}
		if( 1 == num )	{ return new String[]{"#FF0000FF"}; }
		
		String[] listRet = new String[num];
		double dblInc = 1.0 / (double)(num-1);
		double dblVal = 0;
		for(int i=0; i < num; i++, dblVal += dblInc){
			listRet[i] = Integer.toHexString( interpolateColor(dblVal).getRGB() ).toUpperCase();
			listRet[i] = "#" + listRet[i].substring(2) +  "FF";
		}
		return listRet;
	}
	
	public static Color interpolateColor(double rel){
		if( rel < 0.0 )		return new Color(1f, 0f, 0f);
		else if( rel > 1.0)	return new Color(1f, 0f, 1f);
	
		float min = 0f;
		float max = 1f;
		
		switch( (int)(rel/0.16667) ){
			/*
			case 0:				return new Color(max, max*(min + (1-min)*(float)(rel/.25)), min);
			case 1:	rel -= .25;	return new Color(min + max*(1-min)*(float)(1 - rel/.25), max, max*(min + (1-min)*(float)(rel/.25)));
			case 2:	rel -= .50;	return new Color(min, max*(min + (1-min)*(float)(1 - rel/.25)), max);
			case 3:	rel -= .75;	return new Color(max*(min + (1-min)*(float)(rel/.25)), min, max);
			*/
			case 0:					return new Color(max, max*(min + (1-min)*(float)(rel/.25)), min);
			case 1:	rel -= .16667;	return new Color(min + max*(1-min)*(float)(1 - rel/.25), max, min);
			case 2:	rel -= .33333;	return new Color(min, max, max*(min + (1-min)*(float)(rel/.25)));
			case 3:	rel -= .50000;	return new Color(min, max*(1-min)*(float)(1 - rel/.25), max);
			case 4:	rel -= .66667;	return new Color(max*(min + (1-min)*(float)(rel/.25)), min, max);
			case 5:	rel -= .83333;	return new Color(max, min, max*(1-min)*(float)(1 - rel/.25));
			default:				return new Color(max, min, max);
		}
	}

	
	/**
	 * Creates a list of length rep of copies of the input val.  Mimics the R function of the same
	 * name 
	 * @param val Value to repeat
	 * @param rep Number of time to repeat
	 * @return List of repeated values, with length specified by input rep
	 */
	public static String[] rep(String val, int rep){
		if(1 > rep){ return new String[]{}; }
		String[] listRet = new String[rep];
		for(int i=0; i < rep; i++){ listRet[i] = val; }
		return listRet;
	}
	
	/**
	 * Creates a list of length rep of copies of the input val.  Mimics the R function of the same
	 * name 
	 * @param val Value to repeat
	 * @param rep Number of time to repeat
	 * @return List of repeated values, with length specified by input rep
	 */
	public static Integer[] rep(int val, int rep){
		if(1 > rep){ return new Integer[]{}; }
		Integer[] listRet = new Integer[rep];
		for(int i=0; i < rep; i++){ listRet[i] = new Integer(val); }
		return listRet;
	}
	
	/**
	 * Creates a list of the same length as the input list with the elements in reverse order
	 * @param list List to reverse
	 * @return Reversed list
	 */
	public static String[] rev(String[] list){
		String[] ret = new String[list.length];
		for(int i=list.length-1; i >= 0; i--){ ret[i] = list[i]; }
		return ret;
	}
	
	/**
	 * Build a list by removing elements of the input list at the specified frequency.
	 * @param list List to decimate
	 * @param freq (optional) Frequency at which to remove members from the input list, defaults to 30
	 * @return Decimated list
	 */
	public static String[] decimate(String[] list, int freq){
		String[] ret = new String[list.length];
		for(int i=0; i < list.length; i++){ ret[i] = (i % freq == 0? list[i] : ""); }
		return ret;
	}
	public static String[] decimate(String[] list){
		return decimate( list, Math.round( (float)list.length / 30f ) );
	}
	
	
	/**
	 * Append the first array with the values of the second
	 * @param l1 Array to be appended
	 * @param l2 Array to append
	 * @return The combined array
	 */
	public static Object[] append(Object[] l1, Object[] l2, Object[] cast){
		ArrayList listRet = new ArrayList();
		for(int i=0; i < l1.length; i++){ listRet.add(l1[i]); }
		for(int i=0; i < l2.length; i++){ listRet.add(l2[i]); }
		return listRet.toArray(cast);
		
		/*
		List listRet = Arrays.asList(l1);
		listRet.addAll( Arrays.asList(l2) );
		return listRet.toArray();
		*/
	}	
	public static String[]		append( String[] s1,	String[] s2)	{ return (String[])append(s1, s2, new String[]{});			}
	public static String[]		append( String s1,		String[] s2)	{ return append(new String[]{s1}, s2);						}
	public static String[]		append( String[] s1,	String s2)		{ return append(s1, new String[]{s2});						}
	public static Map.Entry[]	append( Map.Entry[] s1,	Map.Entry[] s2)	{ return (Map.Entry[])append(s1, s2, new Map.Entry[]{});	}
	public static MVPlotJob[]	append( MVPlotJob[] s1, MVPlotJob[] s2)	{ return (MVPlotJob[])append(s1, s2, new MVPlotJob[]{});	}
	public static int[]	append(int[] s1, int[] s2){
		if( null == s1 ){ s1 = new int[]{}; }
		if( null == s2 ){ s2 = new int[]{}; }
		int r = 0;
		int[] ret = new int[s1.length + s2.length];
		for(int i=0; i < s1.length; i++){ ret[r++] = s1[i]; }
		for(int i=0; i < s2.length; i++){ ret[r++] = s2[i]; }		
		return ret;
	}
	
	public static String[] unique(String[] data){
		Hashtable table = new Hashtable();
		for(int i=0; i < data.length; i++){ if( !table.containsKey(data[i]) ){ table.put(data[i], "true"); } }
		return (String[])table.keySet().toArray(new String[]{});
	}
	
	public static int sum(int[] data){
		if( 1 > data.length ){ return (int)0; }
		int intSum = 0;
		for(int i=0; i < data.length; i++){ intSum += data[i]; }
		return intSum;
	}
	
	/**
	 * Attempt to convert the input ArrayList, which is assumed to contain all Strings, to a String[]. 
	 * @param list ArrayList to convert
	 * @return Converted list
	 */
	public static String[]		toArray(ArrayList list)					{ return (String[])list.toArray(new String[]{});			}
	
	/**
	 * Create a deep copy of the input list
	 * @param list List to copy
	 * @return Copied list
	 */
	public static MVOrderedMap[] copyList(MVOrderedMap[] list){
		MVOrderedMap[] listRet = new MVOrderedMap[list.length];
		for(int i=0; i < list.length; i++){ listRet[i] = new MVOrderedMap(list[i]); }		
		return listRet;
	}

	/**
	 * Create a deep copy of the input list
	 * @param list List to copy
	 * @return Copied list
	 */
	public static String[] copyList(String[] list){
		String[] listRet = new String[list.length];
		for(int i=0; i < list.length; i++){ listRet[i] = list[i]; }
		return listRet;
	}
	
	/**
	 * Creates a string representation of an R collection containing the list of values in the input
	 * list, val.
	 * @param val List of values to print in the R collection
	 * @param ticks (optional) Print tickmarks around values, for when constituents are factors as 
	 *              opposed to numeric, defaults to true
	 * @return String representation of the R collection
	 */
	public static String printRCol(Object[] val, boolean ticks){
		String strRet = "c(";
		for(int i=0; i < val.length; i++){
			strRet += (0 < i? ", " : "") + (val[i] instanceof String && ticks? "\"" + val[i] + "\"" : val[i]);
		}
		strRet += ")";		
		return strRet;
	}
	public static String printRCol(Object[] val){ return printRCol(val, true); }
	
	/**
	 * Parses an R collection string representation and returns a list of the values in the collection.
	 * An R collection has syntax c(1, 2, 3) or c("a", "bb", "ccc")
	 * @param strRCol
	 * @return list of String representations of each collection member
	 */
	public static String[] parseRCol(String strRCol){
		if( strRCol.contains("\"") ){
			Matcher matRColStr = Pattern.compile("c\\(\\s*\"(.*)\"\\s*\\)").matcher(strRCol);
			if( !matRColStr.matches() ){ return new String[]{}; }		
			String strList = matRColStr.group(1);
			return strList.split("\"\\s*,\\s*\"");
		} else {
			Matcher matRColNum = Pattern.compile("c\\(\\s*(.*)\\s*\\)").matcher(strRCol);
			if( !matRColNum.matches() ){ return new String[]{}; }		
			String strList = matRColNum.group(1);
			return strList.split("\\s*,\\s*");
		}
	}
	
	/**
	 * Returns a string representation of the MVOrderedMap in R declaration syntax
	 * @param map Data structure to convert to R list representation
	 * @return The R-syntax representation of the input map
	 */
	public static String getRDecl(MVOrderedMap map){
		String strRDecl = "list(\n";
		String[] listKeys = (String[])map._listKeys.toArray(new String[]{});
		for(int i=0; i < listKeys.length; i++){
			strRDecl += (0 < i? ",\n" : "") + MVBatch.padBegin( formatR(listKeys[i]) ) + " = ";
			Object objVal = map.get(listKeys[i]);
			if( objVal instanceof String ){
				strRDecl += "\"" + objVal.toString() + "\"";
			} else if( objVal instanceof String[] ){
				strRDecl += "c(";
				String[] listVal = (String[])objVal;
				for(int j=0; j < listVal.length; j++){
					strRDecl += (0 < j? ", " : "") + "\"" + listVal[j] + "\"";
				}
				strRDecl += ")";
			} else if( objVal instanceof MVOrderedMap ){
				strRDecl += ((MVOrderedMap)objVal).getRDecl();
			} else {
				strRDecl += "\"???\",\n";
			}
		}
		strRDecl += "\n)";
		return strRDecl;
	}
	
	
	/**
	 * Format the input String so that it conforms to R variable name standards  
	 * @param in String to format
	 * @return Formatted String
	 */
	public static String formatR(String in){
		
		String strFormatR = in;
		Matcher matProb = _patProb.matcher(in);
		if( matProb.matches() ){
			if( !in.contains("*") ){ strFormatR = "PROB_" + matProb.group(1) + matProb.group(2) + matProb.group(3); }
			else                   { strFormatR = "PROB_" + matProb.group(1);                                       } 
		}		
		
		return strFormatR.replace("(",	"")
						 .replace(")",	"")
						 .replace(".",	"_d_")
						 .replace("<=",	"le")
						 .replace(">=",	"ge")
						 .replace("=",	"eq")
						 .replace("<",	"lt")
						 .replace(">",	"gt");
	}
	
	/**
	 * An instantiable (default) instance of the Map.Entry class for manipulating Map.Entry[] structures
	 */
	class MVMapEntry implements Map.Entry{
		Object key = null;
		Object value = null;
		
		public MVMapEntry(Object k, Object v){ key = k; value = v; } 		
		public boolean equals(Object o){ 
			return 
				o instanceof MVMapEntry &&
				(null == ((MVMapEntry)o).getKey()?   null == key   : ((MVMapEntry)o).getKey().equals(key)) && 
				(null == ((MVMapEntry)o).getValue()? null == value : ((MVMapEntry)o).getValue().equals(value));
		}
		public Object getKey()  { return key; }
		public Object getValue(){ return value; }
		public int hashCode(){
			return (null == key? 0 : key.hashCode()) ^ (null == value? 0 : value.hashCode());
		}
		public Object setValue(Object o){
			Object old = value;
			value = o;
			return old;
		}
		public String toString(){ return key.toString() + "=" + value.toString(); }
	}
	
	/**
	 * Parse the input mode statistic, which is assume to have the form SSSS_FFF, where SSSS is the name
	 * of a mode statistic with arbitrary lenght and FFF is a three character flag indicator string.
	 * @param stat Mode stat to parse
	 * @return if successful, a String[] of length 2, with the stat name as the first component and 
	 * the flag indicator string as the second; otherwise, a String[] of length 1 containing the 
	 * input stat 
	 */
	public static final Pattern _patModeStat = Pattern.compile("([^_]+)(?:_\\w{3})?_(\\w{2,3})");
	public static String[] parseModeStat(String stat){
		Matcher mat = _patModeStat.matcher(stat);
		if( !mat.matches() ){ return new String[]{ stat }; }
		return new String[]{ mat.group(1), mat.group(2) };
	}
	
	/**
	 * Prints a textual representation of the input {@link MVDataTable} with the field names in the 
	 * first row to the specified {@link PrintStream} destination.  
	 * @param res The MVDataTable to print
	 * @param str The stream to write the formatted results to (defaults to _out)
	 * @param delim The delimiter to insert between field headers and values (defaults to ' ')
	 * @param maxRows The max number of rows to print, -1 to print all rows
	 */
	public static void printFormattedTable(MVDataTable tab, PrintStream str, String delim, int maxRows){
		String[] fields = tab.getFields();
		int[] intFieldWidths = new int[tab.getNumFields()];
		for(int i=0; i < fields.length; i++){ intFieldWidths[i] = tab.getMaxFieldLength(fields[i]) + 2; }
		
		for(int i=0; i < fields.length; i++){
			str.print( delim.equals(" ")? padEnd(fields[i], intFieldWidths[i]) : (0 < i? delim : "") + fields[i] );
		}
		str.println();					
		
		MVOrderedMap[] rows = tab.getRows();
		int intPrintRows = (0 < maxRows? (maxRows < rows.length? maxRows : rows.length) : rows.length);
		int intLine = 1;
		for(int i=0; i < intPrintRows; i++){
			for(int j=0; j < fields.length; j++){
				String strVal = (String)rows[i].get(fields[j]); 
				str.print( delim.equals(" ")? padEnd(strVal, intFieldWidths[j]) : (0 < j? delim : "") + strVal );
			}
			str.println();
			if( 0 == 100 % intLine++ ){ str.flush(); }
		}
		if( 0 < maxRows && maxRows < rows.length ){ str.println("(" + (rows.length - maxRows) + " more rows...)"); }
	}
	public void printFormattedTable(MVDataTable tab){ printFormattedTable(tab, _out, " ", 40); }
	public void printFormattedTable(MVDataTable tab, int maxRows){ printFormattedTable(tab, _out, " ", maxRows); }
	public void printFormattedTable(MVDataTable tab, PrintStream str, String delim){ printFormattedTable(tab, str, delim, -1); }
	
	/**
	 * Prints a textual representation of the input {@link ResultSet} with the field names in the 
	 * first row to the specified {@link PrintStream} destination.  
	 * @param res The ResultSet to print
	 * @param str The stream to write the formatted results to (defaults to _out)
	 * @param delim The delimiter to insert between field headers and values (defaults to ' ')
	 * @param maxRows The max number of rows to print, -1 to print all rows
	 */
	public void printFormattedTable(ResultSet res, PrintStream str, String delim, int maxRows){
		try{
			ResultSetMetaData met = res.getMetaData();
	
			//  get the column display widths
			int[] intFieldWidths = new int[met.getColumnCount()];
			for(int i=1; i <= met.getColumnCount(); i++){ intFieldWidths[i-1] = met.getColumnDisplaySize(i) + 2; }
			
			//  print out the column headers
			for(int i=1; i <= met.getColumnCount(); i++){
				str.print(delim.equals(" ")? padEnd(met.getColumnLabel(i), intFieldWidths[i-1]) : (1 < i? delim : "") + met.getColumnLabel(i));
			}
			str.println();

			//  print out the table of values
			int intLine = 1;
			while( res.next() ){
				for(int i=1; i <= met.getColumnCount(); i++){
					String strVal = res.getString(i); 
					try{ strVal = _formatDB.format( _formatDBms.parse(strVal) ); }catch(Exception e){}
					strVal = (strVal.equalsIgnoreCase("null")? "NA" : strVal);
					str.print( delim.equals(" ")? padEnd(strVal, intFieldWidths[i-1]) : (1 < i? delim : "") + strVal );
				}
				str.println();
				if( 0 == 100 % intLine++ ){ str.flush(); }
			}
			
		}catch(Exception e){
			_out.println("  **  ERROR: Caught " + e.getClass() + " in printFormattedTable(ResultSet res): " + e.getMessage());
		}
	}
	public void printFormattedTable(ResultSet res){ printFormattedTable(res, _out, " ", 40); }
	public void printFormattedTable(ResultSet res, int maxRows){ printFormattedTable(res, _out, " ", maxRows); }
	public void printFormattedTable(ResultSet res, PrintStream str, String delim){ printFormattedTable(res, str, delim, -1); }
	
	/**
	 * Run the system command and return the output
	 */
	public static String sysCmd(String cmd) throws Exception {
		Process proc = Runtime.getRuntime().exec("whoami");
		
		boolean boolExit = false;
		String strOut = "";
		BufferedReader readerProcStd = new BufferedReader( new InputStreamReader(proc.getInputStream()) );		
		BufferedReader readerProcErr = new BufferedReader( new InputStreamReader(proc.getErrorStream()) );		
		while( !boolExit ){
			try{
				proc.exitValue();
				boolExit = true;
			} catch(Exception e){}
			
			while( readerProcStd.ready() ){ strOut += readerProcStd.readLine() + "\n"; }
			while( readerProcErr.ready() ){ strOut += readerProcErr.readLine() + "\n"; }			
		}
		readerProcStd.close();			
		readerProcErr.close();
		
		return strOut;
	}
	
	/**
	 * Determine the database line_data table in which the input statistic is stored.  For mode stats,
	 * consider only the first portion of the stat name.  If the stat is not found in any table, return
	 * an empty string. 
	 * @param strStat stat name to look up
	 * @return the name of the database line_data table which contains the stat
	 */
	public static String getStatTable(String strStat){
		String strStatMode = parseModeStat(strStat)[0];
		
		if     ( _tableStatsCnt.containsKey(strStat)                ){ return "line_data_cnt";    }
		else if( _tableStatsCts.containsKey(strStat)                ){ return "line_data_cts";    }
		else if( _tableStatsNbrcnt.containsKey(strStat)             ){ return "line_data_nbrcnt"; }
		else if( _tableStatsNbrcts.containsKey(strStat)             ){ return "line_data_nbrcts"; }
		else if( _tableStatsPstd.containsKey(strStat)               ){ return "line_data_pstd";   }
		else if( _tableStatsMcts.containsKey(strStat)               ){ return "line_data_mcts";   }
		else if( _tableStatsRhist.containsKey(strStat)              ){ return "line_data_rhist";  }
		else if( _tableStatsVl1l2.containsKey(strStat)              ){ return "line_data_vl1l2";  }
		else if( _tableModeSingleStatField.containsKey(strStatMode) ){ return "mode_obj_single";  }
		else if( _tableModePairStatField.containsKey(strStatMode)   ){ return "mode_obj_pair";    }
		else if( _tableModeRatioField.containsKey(strStat)          ){ return "mode_obj_single";  }
		else                                                         { return "";                 }
	}

	
	public static final MVOrderedMap _tableStatsCnt = new MVOrderedMap();
	static{
		_tableStatsCnt.put("FBAR",			new String[]{"nc", "bc"});
		_tableStatsCnt.put("FSTDEV",		new String[]{"nc", "bc"});
		_tableStatsCnt.put("OBAR", 			new String[]{"nc", "bc"});
		_tableStatsCnt.put("OSTDEV", 		new String[]{"nc", "bc"});
		_tableStatsCnt.put("PR_CORR",		new String[]{"nc", "bc"});
		_tableStatsCnt.put("SP_CORR",		new String[]{});
		_tableStatsCnt.put("KT_CORR",		new String[]{});
		_tableStatsCnt.put("ME", 			new String[]{"nc", "bc"});
		_tableStatsCnt.put("ESTDEV",		new String[]{"nc", "bc"});
		_tableStatsCnt.put("MBIAS",			new String[]{"bc"});
		_tableStatsCnt.put("MAE", 			new String[]{"bc"});
		_tableStatsCnt.put("MSE", 			new String[]{"bc"});
		_tableStatsCnt.put("BCMSE", 		new String[]{"bc"});
		_tableStatsCnt.put("BCRMSE", 		new String[]{"bc"});
		_tableStatsCnt.put("RMSE", 			new String[]{"bc"});
		_tableStatsCnt.put("E10", 			new String[]{"bc"});
		_tableStatsCnt.put("E25", 			new String[]{"bc"});
		_tableStatsCnt.put("E50", 			new String[]{"bc"});
		_tableStatsCnt.put("E75", 			new String[]{"bc"});
		_tableStatsCnt.put("E90", 			new String[]{"bc"});
	}
	
	public static final MVOrderedMap _tableStatsCts = new MVOrderedMap();
	static{
		_tableStatsCts.put("BASER",			new String[]{"nc", "bc"});
		_tableStatsCts.put("FMEAN",			new String[]{"nc", "bc"});
		_tableStatsCts.put("ACC", 			new String[]{"nc", "bc"});
		_tableStatsCts.put("FBIAS", 		new String[]{"bc"});
		_tableStatsCts.put("PODY",			new String[]{"nc", "bc"});
		_tableStatsCts.put("PODN",			new String[]{"nc", "bc"});
		_tableStatsCts.put("POFD",			new String[]{"nc", "bc"});
		_tableStatsCts.put("FAR", 			new String[]{"nc", "bc"});
		_tableStatsCts.put("CSI",			new String[]{"nc", "bc"});
		_tableStatsCts.put("GSS",			new String[]{"bc"});
		_tableStatsCts.put("HK", 			new String[]{"nc", "bc"});
		_tableStatsCts.put("HSS", 			new String[]{"bc"});
		_tableStatsCts.put("ODDS", 			new String[]{"nc", "bc"});
	}
	
	public static final MVOrderedMap _tableStatsNbrcts = new MVOrderedMap();
	static{
		_tableStatsNbrcts.put("NBR_BASER",	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_FMEAN",	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_ACC", 	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_FBIAS", 	new String[]{"bc"});
		_tableStatsNbrcts.put("NBR_PODY",	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_PODN",	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_POFD",	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_FAR", 	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_CSI",	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_GSS",	new String[]{"bc"});
		_tableStatsNbrcts.put("NBR_HK", 	new String[]{"nc", "bc"});
		_tableStatsNbrcts.put("NBR_HSS", 	new String[]{"bc"});
		_tableStatsNbrcts.put("NBR_ODDS", 	new String[]{"nc", "bc"});
	}
	
	public static final MVOrderedMap _tableStatsNbrcnt = new MVOrderedMap();
	static{
		_tableStatsNbrcnt.put("NBR_FBS",	new String[]{"bc"});
		_tableStatsNbrcnt.put("NBR_FSS",	new String[]{"bc"});
	}
	
	public static final MVOrderedMap _tableStatsPstd = new MVOrderedMap();
	static{
		_tableStatsPstd.put("PSTD_BASER",	new String[]{"nc"});
		_tableStatsPstd.put("PSTD_RELIABILITY",	new String[]{});
		_tableStatsPstd.put("PSTD_RESOLUTION",	new String[]{});
		_tableStatsPstd.put("PSTD_UNCERTAINTY",	new String[]{});
		_tableStatsPstd.put("PSTD_ROC_AUC",		new String[]{});
		_tableStatsPstd.put("PSTD_BRIER",			new String[]{"nc"});
	}
	
	public static final MVOrderedMap _tableStatsMcts = new MVOrderedMap();
	static{
		_tableStatsMcts.put("MCTS_ACC",		new String[]{"nc", "bc"});
		_tableStatsMcts.put("MCTS_HK",		new String[]{"bc"});
		_tableStatsMcts.put("MCTS_HSS",		new String[]{"bc"});
		_tableStatsMcts.put("MCTS_GER",		new String[]{"bc"});
	}
	
	public static final MVOrderedMap _tableStatsRhist = new MVOrderedMap();
	static{
		_tableStatsRhist.put("RHIST_CRPS",	new String[]{});
		_tableStatsRhist.put("RHIST_IGN",	new String[]{});
	}
	
	public static final MVOrderedMap _tableStatsVl1l2 = new MVOrderedMap();
	static{
		_tableStatsVl1l2.put("VL1L2_UFBAR",	new String[]{});
		_tableStatsVl1l2.put("VL1L2_VFBAR",	new String[]{});
		_tableStatsVl1l2.put("VL1L2_UOBAR",	new String[]{});
		_tableStatsVl1l2.put("VL1L2_VOBAR",	new String[]{});
	}
	
	public static final MVOrderedMap _tableStatHeaderSQLType = new MVOrderedMap();
	static{
		_tableStatHeaderSQLType.put("model",			"VARCHAR(64)");
		_tableStatHeaderSQLType.put("fcst_lead",		"INT UNSIGNED");
		_tableStatHeaderSQLType.put("fcst_valid_beg",	"DATETIME");
		_tableStatHeaderSQLType.put("fcst_valid_end",	"DATETIME");
		_tableStatHeaderSQLType.put("fcst_init_beg",	"DATETIME");
		_tableStatHeaderSQLType.put("obs_lead",			"INT UNSIGNED");
		_tableStatHeaderSQLType.put("obs_valid_beg",	"DATETIME");
		_tableStatHeaderSQLType.put("obs_valid_end",	"DATETIME");
		_tableStatHeaderSQLType.put("init_hour",		"INT UNSIGNED");
		_tableStatHeaderSQLType.put("valid_hour",		"INT UNSIGNED");
		_tableStatHeaderSQLType.put("fcst_var",			"VARCHAR(64)");
		_tableStatHeaderSQLType.put("fcst_lev",			"VARCHAR(16)");
		_tableStatHeaderSQLType.put("obs_var",			"VARCHAR(64)");
		_tableStatHeaderSQLType.put("obs_lev",			"VARCHAR(16)");
		_tableStatHeaderSQLType.put("obtype",			"VARCHAR(32)");
		_tableStatHeaderSQLType.put("vx_mask",			"VARCHAR(32)");
		_tableStatHeaderSQLType.put("interp_mthd",		"VARCHAR(16)");
		_tableStatHeaderSQLType.put("interp_pnts",		"INT UNSIGNED");
		_tableStatHeaderSQLType.put("fcst_thresh",		"VARCHAR(16)");
		_tableStatHeaderSQLType.put("obs_thresh",		"VARCHAR(16)");
	}	
	
	public static final MVOrderedMap _tableModeHeaderSQLType = new MVOrderedMap();
	static{
		_tableModeHeaderSQLType.put("model",		"VARCHAR(64)");
		_tableModeHeaderSQLType.put("fcst_lead",	"INT UNSIGNED");
		_tableModeHeaderSQLType.put("fcst_valid",	"DATETIME");
		_tableModeHeaderSQLType.put("fcst_accum",	"INT UNSIGNED");
		_tableModeHeaderSQLType.put("fcst_init",	"DATETIME");
		_tableModeHeaderSQLType.put("obs_lead",		"INT UNSIGNED");
		_tableModeHeaderSQLType.put("obs_valid",	"DATETIME");
		_tableModeHeaderSQLType.put("obs_accum",	"INT UNSIGNED");
		_tableModeHeaderSQLType.put("init_hour",	"INT UNSIGNED");
		_tableModeHeaderSQLType.put("valid_hour",	"INT UNSIGNED");
		_tableModeHeaderSQLType.put("fcst_rad",		"INT UNSIGNED");
		_tableModeHeaderSQLType.put("fcst_thr",		"VARCHAR(16)");
		_tableModeHeaderSQLType.put("obs_rad",		"INT UNSIGNED");
		_tableModeHeaderSQLType.put("obs_thr",		"VARCHAR(16)");
		_tableModeHeaderSQLType.put("fcst_var",		"VARCHAR(64)");
		_tableModeHeaderSQLType.put("fcst_lev",		"VARCHAR(16)");
		_tableModeHeaderSQLType.put("obs_var",		"VARCHAR(64)");
		_tableModeHeaderSQLType.put("obs_lev", 		"VARCHAR(16)");
	}
	
	public static final MVOrderedMap _tableModePairSQLTypes = new MVOrderedMap();
	static{
		_tableModePairSQLTypes.put("centroid_dist",					"DOUBLE");
		_tableModePairSQLTypes.put("boundary_dist",					"DOUBLE");
		_tableModePairSQLTypes.put("convex_hull_dist",				"DOUBLE");
		_tableModePairSQLTypes.put("angle_diff",					"DOUBLE");
		_tableModePairSQLTypes.put("area_ratio",					"DOUBLE");
		_tableModePairSQLTypes.put("intersection_area",				"INT UNSIGNED");
		_tableModePairSQLTypes.put("union_area",					"INT UNSIGNED");
		_tableModePairSQLTypes.put("symmetric_diff",				"INTEGER");
		_tableModePairSQLTypes.put("intersection_over_area",		"DOUBLE");
		_tableModePairSQLTypes.put("complexity_ratio",				"DOUBLE");
		_tableModePairSQLTypes.put("percentile_intensity_ratio",	"DOUBLE");
		_tableModePairSQLTypes.put("interest",						"DOUBLE");
	}
	
	public static final MVOrderedMap _tableModeSingleSQLTypes = new MVOrderedMap();
	static{
		_tableModeSingleSQLTypes.put("centroid_x",		"DOUBLE");
		_tableModeSingleSQLTypes.put("centroid_y",		"DOUBLE");
		_tableModeSingleSQLTypes.put("centroid_lat",	"DOUBLE");
		_tableModeSingleSQLTypes.put("centroid_lon",	"DOUBLE");
		_tableModeSingleSQLTypes.put("axis_avg",		"DOUBLE");
		_tableModeSingleSQLTypes.put("length",			"DOUBLE");
		_tableModeSingleSQLTypes.put("width",			"DOUBLE");
		_tableModeSingleSQLTypes.put("area",			"INT UNSIGNED");
		_tableModeSingleSQLTypes.put("area_filter",		"INT UNSIGNED");
		_tableModeSingleSQLTypes.put("area_thresh",		"INT UNSIGNED");
		_tableModeSingleSQLTypes.put("curvature",		"DOUBLE");
		_tableModeSingleSQLTypes.put("curvature_x",		"DOUBLE");
		_tableModeSingleSQLTypes.put("curvature_y",		"DOUBLE");
		_tableModeSingleSQLTypes.put("complexity",		"DOUBLE");
		_tableModeSingleSQLTypes.put("intensity_10",	"DOUBLE");
		_tableModeSingleSQLTypes.put("intensity_25",	"DOUBLE");
		_tableModeSingleSQLTypes.put("intensity_50",	"DOUBLE");
		_tableModeSingleSQLTypes.put("intensity_75",	"DOUBLE");
		_tableModeSingleSQLTypes.put("intensity_90",	"DOUBLE");
		_tableModeSingleSQLTypes.put("intensity_nn",	"DOUBLE");
		_tableModeSingleSQLTypes.put("intensity_sum",	"DOUBLE");
	}
	
	public static final MVOrderedMap _tableModeSingleStatField = new MVOrderedMap();
	static{
		_tableModeSingleStatField.put("ACOV",			"SUM(area)");
		_tableModeSingleStatField.put("CNT",			"COUNT(object_id)");
		_tableModeSingleStatField.put("CNTSUM",			"COUNT(object_id)");
		_tableModeSingleStatField.put("CENTX",			"centroid_x");
		_tableModeSingleStatField.put("CENTY",			"centroid_y");
		_tableModeSingleStatField.put("CENTLAT",		"centroid_lat");
		_tableModeSingleStatField.put("CENTLON",		"centroid_lon");
		_tableModeSingleStatField.put("AXAVG",			"axis_avg");
		_tableModeSingleStatField.put("LEN",			"length");
		_tableModeSingleStatField.put("WID",			"width");
		_tableModeSingleStatField.put("ASPECT",			"IF((length/width) < (width/length), length/width, width/length)");
		_tableModeSingleStatField.put("AREA",			"area");
		_tableModeSingleStatField.put("AREAFIL",		"area_filter");
		_tableModeSingleStatField.put("AREATHR",		"area_threshold");
		_tableModeSingleStatField.put("CURV",			"curvature");
		_tableModeSingleStatField.put("CURVX",			"curvature_x");
		_tableModeSingleStatField.put("CURVY",			"curvature_y");
		_tableModeSingleStatField.put("CPLX",			"complexity");
		_tableModeSingleStatField.put("INT10",			"intensity_10");
		_tableModeSingleStatField.put("INT25",			"intensity_25");
		_tableModeSingleStatField.put("INT50",			"intensity_50");
		_tableModeSingleStatField.put("INT75",			"intensity_75");
		_tableModeSingleStatField.put("INT90",			"intensity_90");
		_tableModeSingleStatField.put("INTN",			"intensity_nn");
		_tableModeSingleStatField.put("INTSUM",			"intensity_sum");
	}
	
	public static final MVOrderedMap _tableModePairStatField = new MVOrderedMap();
	static{
		_tableModePairStatField.put("CENTDIST",			"centroid_dist");
		_tableModePairStatField.put("BOUNDDIST",		"boundary_dist");
		_tableModePairStatField.put("HULLDIST",			"convex_hull_dist");
		_tableModePairStatField.put("ANGLEDIFF",		"angle_diff");
		_tableModePairStatField.put("AREARATIO",		"area_ratio");
		_tableModePairStatField.put("INTAREA",			"intersection_area");
		_tableModePairStatField.put("UNIONAREA",		"union_area");
		_tableModePairStatField.put("SYMDIFF",			"symmetric_diff");
		_tableModePairStatField.put("INTOVERAREA",		"intersection_over_area");
		_tableModePairStatField.put("CMPLXRATIO",		"complexity_ratio");
		_tableModePairStatField.put("PERCINTRATIO",		"percentile_intensity_ratio");
		_tableModePairStatField.put("INT",				"interest");
		_tableModePairStatField.put("MAXINT",			"MAX(interest)");
		_tableModePairStatField.put("MAXINTF",			"MAX(interest)");
		_tableModePairStatField.put("MAXINTO",			"MAX(interest)");
	}
	
	public static final MVOrderedMap _tableModeRatioField = new MVOrderedMap();
	static{
		_tableModeRatioField.put("RATIO_FSA_ASA",	"SUM(fcst_flag = 1 && simple_flag = 1) / SUM(simple_flag = 1)"); 
		_tableModeRatioField.put("RATIO_OSA_ASA",	"SUM(fcst_flag = 0 && simple_flag = 1) / SUM(simple_flag = 1)");
		_tableModeRatioField.put("RATIO_ASM_ASA",	"SUM(simple_flag = 1 && matched_flag = 1) / SUM(simple_flag = 1)");
		_tableModeRatioField.put("RATIO_ASU_ASA",	"SUM(simple_flag = 1 && matched_flag = 0) / SUM(simple_flag = 1)");
		_tableModeRatioField.put("RATIO_FSM_FSA",	"SUM(fcst_flag = 1 && simple_flag = 1 && matched_flag = 1) / SUM(fcst_flag = 1 && simple_flag = 1)");
		_tableModeRatioField.put("RATIO_FSU_FSA",	"SUM(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0) / SUM(fcst_flag = 1 && simple_flag = 1)");  
		_tableModeRatioField.put("RATIO_OSM_OSA",	"SUM(fcst_flag = 0 && simple_flag = 1 && matched_flag = 1) / SUM(fcst_flag = 0 && simple_flag = 1)");
		_tableModeRatioField.put("RATIO_OSU_OSA",	"SUM(fcst_flag = 0 && simple_flag = 1 && matched_flag = 0) / SUM(fcst_flag = 0 && simple_flag = 1)");
		_tableModeRatioField.put("RATIO_FSM_ASM",	"SUM(fcst_flag = 1 && simple_flag = 1 && matched_flag = 1) / SUM(simple_flag = 1 && matched_flag = 1)");
		_tableModeRatioField.put("RATIO_OSM_ASM",	"SUM(fcst_flag = 0 && simple_flag = 1 && matched_flag = 1) / SUM(simple_flag = 1 && matched_flag = 1)");
		_tableModeRatioField.put("RATIO_FSU_ASU",	"SUM(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0) / SUM(simple_flag = 1 && matched_flag = 0)");  
		_tableModeRatioField.put("RATIO_OSU_ASU",	"SUM(fcst_flag = 0 && simple_flag = 1 && matched_flag = 0) / SUM(simple_flag = 1 && matched_flag = 0)");  		
		_tableModeRatioField.put("RATIO_FSA_AAA",	"SUM(fcst_flag = 1 && simple_flag = 1) / count(object_id)");  
		_tableModeRatioField.put("RATIO_OSA_AAA",	"SUM(fcst_flag = 0 && simple_flag = 1) / count(object_id)");  
		_tableModeRatioField.put("RATIO_FSA_FAA",	"SUM(fcst_flag = 1 && simple_flag = 1) / SUM(fcst_flag = 1)"); 
		_tableModeRatioField.put("RATIO_FCA_FAA",	"SUM(fcst_flag = 1 && simple_flag = 0) / SUM(fcst_flag = 1)");
		_tableModeRatioField.put("RATIO_OSA_OAA",	"SUM(fcst_flag = 0 && simple_flag = 1) / SUM(fcst_flag = 0)");
		_tableModeRatioField.put("RATIO_OCA_OAA",	"SUM(fcst_flag = 0 && simple_flag = 0) / SUM(fcst_flag = 0)");
		_tableModeRatioField.put("RATIO_FCA_ACA",	"SUM(fcst_flag = 1 && simple_flag = 0) / SUM(simple_flag = 0)");
		_tableModeRatioField.put("RATIO_OCA_ACA",	"SUM(fcst_flag = 0 && simple_flag = 0) / SUM(simple_flag = 0)");
		_tableModeRatioField.put("RATIO_FSA_OSA",	"SUM(fcst_flag = 1 && simple_flag = 1) / SUM(fcst_flag = 0 && simple_flag = 1)");
		_tableModeRatioField.put("RATIO_OSA_FSA",	"SUM(fcst_flag = 0 && simple_flag = 1) / SUM(fcst_flag = 1 && simple_flag = 1)");
		_tableModeRatioField.put("RATIO_ACA_ASA",	"SUM(simple_flag = 0) / SUM(simple_flag = 1)");
		_tableModeRatioField.put("RATIO_ASA_ACA",	"SUM(simple_flag = 1) / SUM(simple_flag = 0)");
		_tableModeRatioField.put("RATIO_FCA_FSA",	"SUM(fcst_flag = 1 && simple_flag = 0) / SUM(fcst_flag = 1 && simple_flag = 1)");
		_tableModeRatioField.put("RATIO_FSA_FCA",	"SUM(fcst_flag = 1 && simple_flag = 1) / SUM(fcst_flag = 1 && simple_flag = 0)");
		_tableModeRatioField.put("RATIO_OCA_OSA",	"SUM(fcst_flag = 0 && simple_flag = 0) / SUM(fcst_flag = 0 && simple_flag = 1)");
		_tableModeRatioField.put("RATIO_OSA_OCA",	"SUM(fcst_flag = 0 && simple_flag = 1) / SUM(fcst_flag = 0 && simple_flag = 0)");
		
		_tableModeRatioField.put("OBJHITS",		"SUM(simple_flag = 1 && matched_flag = 1) / 2");
		_tableModeRatioField.put("OBJMISSES",	"SUM(fcst_flag = 0 && simple_flag = 1 && matched_flag = 0)");
		_tableModeRatioField.put("OBJFAS",		"SUM(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0)");
		_tableModeRatioField.put("OBJCSI",		"SUM(simple_flag = 1 && matched_flag = 1) / ( SUM(simple_flag = 1 && matched_flag = 1) + 2 * SUM(simple_flag = 1 && matched_flag = 0) )");
		_tableModeRatioField.put("OBJPODY",		"SUM(simple_flag = 1 && matched_flag = 1) / " +
												"( SUM(simple_flag = 1 && matched_flag = 1) + 2 * SUM(fcst_flag = 0 && simple_flag = 1 && matched_flag = 0) )");
		_tableModeRatioField.put("OBJFAR",		"SUM(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0) / " +
												"( SUM(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0) + SUM(simple_flag = 1 && matched_flag = 1) / 2 )");

		_tableModeRatioField.put("AREARAT_FSA_ASA",	"SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) ) / SUM( IF(simple_flag = 1, area, 0) )"); 
		_tableModeRatioField.put("AREARAT_OSA_ASA",	"SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) ) / SUM( IF(simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_ASM_ASA",	"SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) ) / SUM( IF(simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_ASU_ASA",	"SUM( IF(simple_flag = 1 && matched_flag = 0, area, 0) ) / SUM( IF(simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_FSM_FSA",	"SUM( IF(fcst_flag = 1 && simple_flag = 1 && matched_flag = 1, area, 0) ) / SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_FSU_FSA",	"SUM( IF(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0, area, 0) ) / SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) )");  
		_tableModeRatioField.put("AREARAT_OSM_OSA",	"SUM( IF(fcst_flag = 0 && simple_flag = 1 && matched_flag = 1, area, 0) ) / SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_OSU_OSA",	"SUM( IF(fcst_flag = 0 && simple_flag = 1 && matched_flag = 0, area, 0) ) / SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_FSM_ASM",	"SUM( IF(fcst_flag = 1 && simple_flag = 1 && matched_flag = 1, area, 0) ) / SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_OSM_ASM",	"SUM( IF(fcst_flag = 0 && simple_flag = 1 && matched_flag = 1, area, 0) ) / SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_FSU_ASU",	"SUM( IF(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0, area, 0) ) / SUM( IF(simple_flag = 1 && matched_flag = 0, area, 0) )");  
		_tableModeRatioField.put("AREARAT_OSU_ASU",	"SUM( IF(fcst_flag = 0 && simple_flag = 1 && matched_flag = 0, area, 0) ) / SUM( IF(simple_flag = 1 && matched_flag = 0, area, 0) )");  		
		_tableModeRatioField.put("AREARAT_FSA_AAA",	"SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) ) / count(object_id)");  
		_tableModeRatioField.put("AREARAT_OSA_AAA",	"SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) ) / count(object_id)");  
		_tableModeRatioField.put("AREARAT_FSA_FAA",	"SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) ) / SUM( IF(fcst_flag = 1, area, 0) )"); 
		_tableModeRatioField.put("AREARAT_FCA_FAA",	"SUM( IF(fcst_flag = 1 && simple_flag = 0, area, 0) ) / SUM( IF(fcst_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_OSA_OAA",	"SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) ) / SUM( IF(fcst_flag = 0, area, 0) )");
		_tableModeRatioField.put("AREARAT_OCA_OAA",	"SUM( IF(fcst_flag = 0 && simple_flag = 0, area, 0) ) / SUM( IF(fcst_flag = 0, area, 0) )");
		_tableModeRatioField.put("AREARAT_FCA_ACA",	"SUM( IF(fcst_flag = 1 && simple_flag = 0, area, 0) ) / SUM( IF(simple_flag = 0, area, 0) )");
		_tableModeRatioField.put("AREARAT_OCA_ACA",	"SUM( IF(fcst_flag = 0 && simple_flag = 0, area, 0) ) / SUM( IF(simple_flag = 0, area, 0) )");
		_tableModeRatioField.put("AREARAT_FSA_OSA",	"SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) ) / SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_OSA_FSA",	"SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) ) / SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_ACA_ASA",	"SUM( IF(simple_flag = 0, area, 0) ) / SUM( IF(simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_ASA_ACA",	"SUM( IF(simple_flag = 1, area, 0) ) / SUM( IF(simple_flag = 0, area, 0) )");
		_tableModeRatioField.put("AREARAT_FCA_FSA",	"SUM( IF(fcst_flag = 1 && simple_flag = 0, area, 0) ) / SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_FSA_FCA",	"SUM( IF(fcst_flag = 1 && simple_flag = 1, area, 0) ) / SUM( IF(fcst_flag = 1 && simple_flag = 0, area, 0) )");
		_tableModeRatioField.put("AREARAT_OCA_OSA",	"SUM( IF(fcst_flag = 0 && simple_flag = 0, area, 0) ) / SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) )");
		_tableModeRatioField.put("AREARAT_OSA_OCA",	"SUM( IF(fcst_flag = 0 && simple_flag = 1, area, 0) ) / SUM( IF(fcst_flag = 0 && simple_flag = 0, area, 0) )");
		
		_tableModeRatioField.put("OBJAHITS",		"SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) ) / 2");
		_tableModeRatioField.put("OBJAMISSES",		"SUM( IF(fcst_flag = 0 && simple_flag = 1 && matched_flag = 0, area, 0) )");
		_tableModeRatioField.put("OBJAFAS",			"SUM( IF(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0, area, 0) )");
		_tableModeRatioField.put("OBJACSI",			"SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) ) / " +
													"( SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) ) + 2 * SUM( IF(simple_flag = 1 && matched_flag = 0, area, 0) ) )");
		_tableModeRatioField.put("OBJAPODY",		"SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) ) / " +
													"( SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) ) + 2 * SUM( IF(fcst_flag = 0 && simple_flag = 1 && matched_flag = 0, area, 0) ) )");
		_tableModeRatioField.put("OBJAFAR",			"SUM( IF(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0, area, 0) ) / " +
													"( SUM( IF(fcst_flag = 1 && simple_flag = 1 && matched_flag = 0, area, 0) ) + SUM( IF(simple_flag = 1 && matched_flag = 1, area, 0) ) / 2 )");
	}
	
	public static final MVOrderedMap _tableCalcStatCTC = new MVOrderedMap();
	static{
		_tableCalcStatCTC.put("BASER", "(d$fy_oy + d$fn_oy) / d$total");
		
		_tableCalcStatCTC.put("BASER",	"IF(0 == d$total,						'NA', ( (d$fy_oy + d$fn_oy) / d$total ))");
		_tableCalcStatCTC.put("ACC",	"IF(0 == d$total,						'NA', ( (d$fy_oy + d$fn_on) / d$total ))");
		_tableCalcStatCTC.put("FBIAS",	"IF(0 == (d$fy_oy + d$fn_oy),			'NA', ( (d$fy_oy + d$fy_on) / (d$fy_oy + d$fn_oy) ))");
		_tableCalcStatCTC.put("PODY",	"IF(0 == (d$fy_oy + d$fn_oy),			'NA', ( d$fy_oy / (d$fy_oy + d$fn_oy) ))");
		_tableCalcStatCTC.put("POFD",	"IF(0 == (d$fy_on + d$fn_on),			'NA', ( d$fy_on / (d$fy_on + d$fn_on) ))");
		_tableCalcStatCTC.put("PODN",	"IF(0 == (d$fy_on + d$fn_on),			'NA', ( d$fn_on / (d$fy_on + d$fn_on) ))");
		_tableCalcStatCTC.put("FAR",	"IF(0 == (d$fy_oy + d$fy_on),			'NA', ( d$fy_on / (d$fy_oy + d$fy_on) ))");
		_tableCalcStatCTC.put("CSI",	"IF(0 == (d$fy_oy + d$fy_on + d$fn_oy),	'NA', ( d$fy_oy / (d$fy_oy + d$fy_on + d$fn_oy) ))");
		_tableCalcStatCTC.put("GSS",	"IF(0 == (d$fy_oy + d$fy_on + d$fn_oy),	'NA', ( d$fy_oy / (d$fy_oy + d$fy_on + d$fn_oy) ))");
	}
	
}
