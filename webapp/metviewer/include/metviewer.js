var _strDBCon = "";
var _strInitXML = "";

var TMPL_SERIES_PLOT = 1;
var TMPL_BAR_PLOT = 2;
var TMPL_BOX_PLOT = 3;
var TMPL_RHIST = 4;
var TMPL_ROC = 5;
var TMPL_RELY = 6;
var TMPL_ENS_SS = 7;
var _intTmpl = TMPL_SERIES_PLOT;

var _listLnkSer = ["Dep1", "Series1", "Dep2", "Series2", "Fix", "FixSpc", "Indy", "AggStat", "CalcStat", "FmtPlot", "FmtSeries"];

var _intDepIdNext = 1;
var _listDep1Div = new Array();
var _listDep2Div = new Array();

var _divFieldVal;
var _intFieldValIdNext = 0;


var _listStatModelRatio = [ "RATIO_FSA_ASA", "RATIO_OSA_ASA", "RATIO_ASM_ASA", "RATIO_ASU_ASA", "RATIO_FSM_FSA",
    "RATIO_FSU_FSA", "RATIO_OSM_OSA", "RATIO_OSU_OSA", "RATIO_FSM_ASM", "RATIO_OSM_ASM",
    "RATIO_FSU_ASU", "RATIO_OSU_ASU", "RATIO_FSA_AAA", "RATIO_OSA_AAA", "RATIO_FSA_FAA",
    "RATIO_FCA_FAA", "RATIO_OSA_OAA", "RATIO_OCA_OAA", "RATIO_FCA_ACA", "RATIO_OCA_ACA",
    "RATIO_FSA_OSA", "RATIO_OSA_FSA", "RATIO_ACA_ASA", "RATIO_ASA_ACA", "RATIO_FCA_FSA",
    "RATIO_FSA_FCA", "RATIO_OCA_OSA", "RATIO_OSA_OCA", "OBJHITS", "OBJMISSES", "OBJFAS",
    "OBJCSI", "OBJPODY", "OBJFAR",

    "AREARAT_FSA_ASA", "AREARAT_OSA_ASA", "AREARAT_ASM_ASA", "AREARAT_ASU_ASA", "AREARAT_FSM_FSA",
    "AREARAT_FSU_FSA", "AREARAT_OSM_OSA", "AREARAT_OSU_OSA", "AREARAT_FSM_ASM", "AREARAT_OSM_ASM",
    "AREARAT_FSU_ASU", "AREARAT_OSU_ASU", "AREARAT_FSA_AAA", "AREARAT_OSA_AAA", "AREARAT_FSA_FAA",
    "AREARAT_FCA_FAA", "AREARAT_OSA_OAA", "AREARAT_OCA_OAA", "AREARAT_FCA_ACA", "AREARAT_OCA_ACA",
    "AREARAT_FSA_OSA", "AREARAT_OSA_FSA", "AREARAT_ACA_ASA", "AREARAT_ASA_ACA", "AREARAT_FCA_FSA",
    "AREARAT_FSA_FCA", "AREARAT_OCA_OSA", "AREARAT_OSA_OCA", "OBJAHITS", "OBJAMISSES", "OBJAFAS",
    "OBJACSI", "OBJAPODY", "OBJAFAR"
];

var _listStatModeSingle = [
    "ACOV", "CNT", "CNTSUM", "CENTX", "CENTY", "CENTLAT", "CENTLON", "AXAVG", "LEN", "WID", "ASPECT",
    "AREA", "AREAFIL", "AREATHR", "CURV", "CURVX", "CURVY", "CPLX", "INT10", "INT25", "INT50",
    "INT75", "INT90", "INTN", "INTSUM"


];

var _listStatModePair = [
    "CENTDIST", "BOUNDDIST", "HULLDIST", "ANGLEDIFF", "AREARATIO", "INTAREA", "UNIONAREA",
    "SYMDIFF", "INTOVERAREA", "CMPLXRATIO", "PERCINTRATIO", "INT", "MAXINT", "MAXINTF", "MAXINTO"
];

var _listStatMode = _listStatModeSingle.concat(_listStatModePair);

var _listVarStat = ["MODEL", "FCST_LEAD", "FCST_VALID_BEG", "VALID_HOUR", "FCST_INIT_BEG", "INIT_HOUR", "FCST_LEV",
    "OBTYPE", "VX_MASK", "INTERP_MTHD", "INTERP_PNTS", "FCST_THRESH"];
var _listVarSpc = ["FCST_VAR", "MODEL", "FCST_LEAD", "FCST_VALID_BEG", "VALID_HOUR", "FCST_INIT_BEG", "INIT_HOUR",
    "FCST_LEV", "OBTYPE", "VX_MASK", "INTERP_MTHD", "INTERP_PNTS", "FCST_THRESH", "OBS_THRESH"];
var _listVarRhist = ["FCST_VAR", "MODEL", "FCST_LEAD", "FCST_VALID_BEG", "VALID_HOUR", "FCST_INIT_BEG", "INIT_HOUR",
    "FCST_LEV", "OBTYPE", "VX_MASK", "INTERP_MTHD", "INTERP_PNTS", "FCST_THRESH", "N_RANK"];
var _listVarMode = ["MODEL", "FCST_LEAD", "FCST_VALID", "VALID_HOUR", "FCST_INIT", "INIT_HOUR", "FCST_ACCUM",
    "FCST_RAD", "FCST_THR", "FCST_LEV"];
var _listVar = _listVarStat;

var _listSeries1Div = new Array();
var _listSeries2Div = new Array();
var _listFixDiv = new Array();
var _listFixSpcDiv = new Array();

var _listIndyVarStat = ["MODEL","FCST_LEAD", "FCST_LEV", "FCST_THRESH", "OBS_THRESH", "FCST_VALID_BEG", "VALID_HOUR",
    "FCST_INIT_BEG", "INIT_HOUR", "INTERP_PNTS","FCST_THRESH","VX_MASK"];
var _listIndyVarMode = ["MODEL","FCST_LEAD", "FCST_LEV", "FCST_THR", "FCST_VALID", "VALID_HOUR", "FCST_INIT", "INIT_HOUR",
    "FCST_RAD","VX_MASK"];
var _listIndyVar = _listIndyVarStat;
var _intIndyValIdNext = 0;

var _strPlotData = "stat";

var _strFmtPlotWidth = "275px";
var _intNumFmtPlotCol = 4;
var _intFmtPlotTxtIndex = 0;
var _intFmtPlotBoolIndex = 0;
var _intNumSeries = 0;
var _listFmtSeriesDefaults = ["false", "false", "none", "", "20", "b", "1", "1", "1", ""];

var seriesDiffY1 = [];
var seriesDiffY2 = [];
var series1Names = [];
var series2Names = [];
var group_name_to_value_map = new Object();


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Administration/Utility Functions
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * When the page loads, perform the initialization duties including setting
 * pointers to DHTML elements, loading the list of databases and populating the
 * various database field lists.
 */

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function createNewDiffSeriesName(yAxis) {
    if($('#series1Y' + yAxis).val() && $('#series2Y' + yAxis).val()){
        $('#newDiffSeriesName').text("DIFF ( " + $('#series1Y' + yAxis).val() + "-" + $('#series2Y' + yAxis).val() + " )");
    }else{
        $('#newDiffSeriesName').text("N/A");
    }
}
function populateSecondSelect(yAxis) {
       if ($('#series1Y' + yAxis).children().length > 0) {
           var selectedSeries = $('#series1Y' + yAxis).val();
           var variableStatArray = selectedSeries.split(" ");
           var variableStat, includedSeriesNames;
           if (variableStatArray.length > 2) {
               variableStat = variableStatArray[variableStatArray.length - 2] + " " + variableStatArray[variableStatArray.length - 1];
           }
           if (yAxis == 1) {
               includedSeriesNames = series1Names;
           } else {
               includedSeriesNames = series2Names;
           }
           $('#series2Y' + yAxis).empty();
           for (var i = 0; i < includedSeriesNames.length; i++) {
               if (includedSeriesNames[i].endsWith(variableStat) && selectedSeries != includedSeriesNames[i]) {
                   $('#series2Y' + yAxis).append($("<option></option>")
                           .attr("value", includedSeriesNames[i])
                           .text(includedSeriesNames[i]));

               }
           }
       }
   }

function changeYAxis(yAxis) {
    if (yAxis == 2) {
        $('#series1Y2').removeAttr('disabled');
        $('#series2Y2').removeAttr('disabled');
        $('#series1Y1').attr("disabled", "disabled");
        $('#series2Y1').attr("disabled", "disabled");
        createNewDiffSeriesName(2);
    } else {
        $('#series1Y2').attr("disabled", "disabled");
        $('#series2Y2').attr("disabled", "disabled");
        $('#series1Y1').removeAttr('disabled');
        $('#series2Y1').removeAttr('disabled');
        createNewDiffSeriesName(1);
    }
}

function onLoad() {
    $("#addDiffCurveDialogForm").dialog({
        autoOpen: false,
        height: "auto",
        width: "auto",
        modal: true,
        position: {
            my: "center center",
            at: "center center",
            of: "#btnFmtAddDifferenceCurve"
        },
        buttons: {
            "Create a Difference Curve": function () {
                var valid=false;
                var yAxisValue = $('input:radio[name=yAxisDiff]:checked').val();
                if (yAxisValue.indexOf("1") !== -1) {
                    if($('#series1Y1').val() &&  $('#series2Y1').val()){
                        seriesDiffY1.push($('#series1Y1').val() + "--" + $('#series2Y1').val());
                        valid = true;
                    }
                } else {
                    if($('#series1Y2').val() &&  $('#series2Y2').val()){
                        seriesDiffY2.push($('#series1Y2').val() + "--" + $('#series2Y2').val());
                        valid = true;
                    }
                }
                $(this).dialog("close");
                if(valid){
                    buildSeriesDiv();
                    //force Event Equalizer
                    $('#spanFmtPlotBool select:first').val("true");
                }

            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        open: function () {
            var seriesNames = document.getElementsByName("seriesName");
            $('#series1Y2').empty();
            $('#series1Y1').empty();
            $('#series2Y2').empty();
            $('#series2Y1').empty();

            $("#y1AxisDiff").prop("checked", true);
            $("#y2AxisDiff").removeAttr("checked");

            $('#series1Y2').attr("disabled", true);
            $('#series2Y2').attr("disabled", true);
            $('#series1Y1').removeAttr('disabled');
            $('#series2Y1').removeAttr('disabled');
            $('#y2AxisDiff').removeAttr("disabled");
            $('#y1AxisDiff').removeAttr("disabled");
            series1Names=[];
            series2Names=[];


            for (var i = 0; i < seriesNames.length; i++) {
                var isInclude = false;
                if (seriesNames[i].innerHTML.indexOf('DIFF') != 0) {

                    // curve can be included ONLY if it is MODE Ratio stat or any of Stat stats
                    if (_strPlotData == "mode") {
                        var desc = seriesNames[i].innerHTML.split(" ");
                        if (_listStatModelRatio.indexOf(desc[desc.length - 1]) > -1) {
                            isInclude = true;
                        }
                    } else {
                        isInclude = true;
                    }
                }


                if (isInclude) {
                    var yAxisText = seriesNames[i].parentNode.getElementsByTagName("span")[2].innerHTML;

                    if (yAxisText.indexOf("2") !== -1) {
                        $('#series1Y2')
                                .append($("<option></option>")
                                        .attr("value", seriesNames[i].innerHTML)
                                        .text(seriesNames[i].innerHTML));
                        series1Names.push(seriesNames[i].innerHTML);
                    } else {
                        $('#series1Y1')
                                .append($("<option></option>")
                                        .attr("value", seriesNames[i].innerHTML)
                                        .text(seriesNames[i].innerHTML));

                        series1Names.push(seriesNames[i].innerHTML);
                    }
                }
            }

            populateSecondSelect(1);
            populateSecondSelect(2);

            if ($("#series1Y2 option").length > 0 && $("#series1Y1 option").length > 0) {
                createNewDiffSeriesName(1);
            } else {
                if ($("#series1Y2 option").length == 0) {
                    $('#y2AxisDiff').attr("disabled", true);
                    createNewDiffSeriesName(1);
                }
                if ($("#series1Y1 option").length == 0) {
                    $('#y1AxisDiff').attr("disabled", true);
                    $("#y1AxisDiff").removeAttr("checked");
                    $("#y2AxisDiff").prop("checked", true);
                    $('#series1Y2').removeAttr('disabled');
                    $('#series2Y2').removeAttr('disabled');
                    $('#series1Y1').attr("disabled", true);
                    $('#series2Y1').attr("disabled", true);
                    createNewDiffSeriesName(2);
                }
            }


        },
        close: function () {
            //allFields.val("").removeClass("ui-state-error");
        }
    });



    document.getElementById('selPlotData').value = 'stat';
    _url = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + "servlet";
    debug("_url: " + _url + "\n\n");

    _boolIE = (-1 != navigator.appName.indexOf("Internet Explorer"));

    /*
     debug(
     "browser codeName: " + 	navigator.appCodeName + "\n" + 
     "browser name: " + 		navigator.appName + "\n" + 
     "browser version: " +	navigator.appVersion + "\n" + 
     "cookies enabled: " +	navigator.cookieEnabled + "\n" + 
     "platform: " + navigator.platform + "\n" +
     "user-agent header: " + navigator.userAgent + "\n" +
     "IE: " + (_boolIE? "true" : "false") + "\n\n"
     );
     */
    debug("load() - IE: " + (_boolIE ? "true" : "false") + "\n\n");

    //  add a handler to ensure that the Loading... screen tracks with scrolling
    window.onscroll = function (e) {
        if (_boolDim) {
            dimScreen(true);
        }
    }

    //  initialize the debug controls
    setDebugDisp(_boolDebugDisp);

    //  initialize the plot format controls
    for (var i = 1; i < _intNumFmtPlotCol; i++) {
        var tdFmtPlotBool = document.getElementById("trFmtPlotBool").insertCell(i);
        tdFmtPlotBool.align = "right";
        tdFmtPlotBool.style.width = _strFmtPlotWidth;
    }
    for (var i = 1; i < _intNumFmtPlotCol; i++) {
        var tdFmtPlotTxt = document.getElementById("trFmtPlotTxt").insertCell(i);
        tdFmtPlotTxt.align = "right";
        tdFmtPlotTxt.style.width = _strFmtPlotWidth;
    }

    //  add the boolean formatting option controls
    addFmtPlot("Event Equalizer", "event_equal", "false", "bool");
    addFmtPlot("Event Equalizer Multi", "event_equal_m", "false", "bool");
    addFmtPlot("Vertical Levels Plot", "vert_plot", "false", "bool");
    addFmtPlot("Reverse X Values", "x_reverse", "false", "bool");
    addFmtPlot("Display Number of Stats", "num_stats", "false", "bool");
    addFmtPlot("Y1 Stagger Points", "indy1_stag", "false", "bool");
    addFmtPlot("Y2 Stagger Points", "indy2_stag", "false", "bool");
    addFmtPlot("Plot Grid", "grid_on", "true", "bool");
    addFmtPlot("Synch Y1 and Y2 Ranges", "sync_axes", "false", "bool");
    addFmtPlot("Print Y1 Series Values", "dump_points1", "false", "bool");
    addFmtPlot("Print Y2 Series Values", "dump_points2", "false", "bool");
    addFmtPlot("Y1 Axis Log Scale", "log_y1", "false", "bool");
    addFmtPlot("Y2 Axis Log Scale", "log_y2", "false", "bool");
    addFmtPlot("Variance Inflation Factor", "varianceInflationFactor", "true", "bool");

    //  add onchange listeners to some controls
    var tabFmtPlot = document.getElementById("tabFmtPlotBool");
    var selVertPlot = tabFmtPlot.rows[0].cells[2].getElementsByTagName("select")[0];
    selVertPlot.setAttribute("onchange", "javascript:updateFmtPlot()");
    if (_boolIE) {
        selVertPlot.attachEvent("onchange", new Function("updateFmtPlot()"));
    }
    var selPlot1Diff = tabFmtPlot.rows[1].cells[0].getElementsByTagName("select")[0];
    selPlot1Diff.setAttribute("onchange", "javascript:buildSeriesDiv()");
    if (_boolIE) {
        selPlot1Diff.attachEvent("onchange", new Function("buildSeriesDiv()"));
    }
    var selPlot2Diff = tabFmtPlot.rows[1].cells[1].getElementsByTagName("select")[0];
    selPlot2Diff.setAttribute("onchange", "javascript:buildSeriesDiv()");
    if (_boolIE) {
        selPlot2Diff.attachEvent("onchange", new Function("buildSeriesDiv()"));
    }

    //  add the text formatting options
    addFmtPlot("Plot Image Type", "plot_type", "png16m", "txt");
    addFmtPlot("Plot Height", "plot_height", "8.5", "txt");
    addFmtPlot("Plot Width", "plot_width", "11", "txt");
    addFmtPlot("Plot Resolution", "plot_res", "72", "txt");
    addFmtPlot("Plot Units", "plot_units", ["in", "mm"], "txt");
    addFmtPlot("Plot Margins", "mar", "c(8, 4, 5, 4)", "txt");
    addFmtPlot("Axis Margin Line", "mgp", "c(1, 1, 0)", "txt");
    addFmtPlot("Text Magnification", "cex", "1", "txt");
    addFmtPlot("Title Text Weight", "title_weight", ["2", "1", "3", "4", "5"], "txt");
    addFmtPlot("Title Text Size", "title_size", "1.4", "txt");
    addFmtPlot("Title Vert Offset", "title_offset", "-2", "txt");
    addFmtPlot("Title Horiz Align", "title_align", ".5", "txt");
    addFmtPlot("X1 Values Orientation", "xtlab_orient", ["1", "3"], "txt");
    addFmtPlot("X1 Values Perp Offset ", "xtlab_perp", "-.75", "txt");
    addFmtPlot("X1 Values Horiz Align", "xtlab_horiz", ".5", "txt");
    addFmtPlot("X1 Values Frequency", "xtlab_freq", "0", "txt");
    addFmtPlot("X1 Values Size", "xtlab_size", "1", "txt");
    addFmtPlot("X1 Label Text Weight", "xlab_weight", ["1", "2", "3", "4", "5"], "txt");
    addFmtPlot("X1 Label Text Size", "xlab_size", "1", "txt");
    addFmtPlot("X1 Label Perp Offset", "xlab_offset", "2", "txt");
    addFmtPlot("X1 Label Horiz Align", "xlab_align", ".5", "txt");
    addFmtPlot("Y1 Values Orientation", "ytlab_orient", ["1", "3"], "txt");
    addFmtPlot("Y1 Values Perp Offset", "ytlab_perp", ".5", "txt");
    addFmtPlot("Y1 Values Horiz Align", "ytlab_horiz", ".5", "txt");
    addFmtPlot("Y1 Values Size", "ytlab_size", "1", "txt");
    addFmtPlot("Y1 Label Text Weight", "ylab_weight", ["1", "2", "3", "4", "5"], "txt");
    addFmtPlot("Y1 Label Text Size", "ylab_size", "1", "txt");
    addFmtPlot("Y1 Label Perp Offset", "ylab_offset", "-2", "txt");
    addFmtPlot("Y1 Label Horiz Align", "ylab_align", ".5", "txt");
    addFmtPlot("Grid Line Type", "grid_lty", ["3", "1", "2", "4", "5", "6"], "txt");
    addFmtPlot("Grid Line Color", "grid_col", "#CCCCCC", "txt");
    addFmtPlot("Grid Line Width", "grid_lwd", "1", "txt");
    addFmtPlot("Grid X positions", "grid_x", "listX", "txt");
    addFmtPlot("X2 Stats Orientation", "x2tlab_orient", ["1", "3"], "txt");
    addFmtPlot("X2 Stats Perp Offset", "x2tlab_perp", "1", "txt");
    addFmtPlot("X2 Stats Horiz Align", "x2tlab_horiz", ".5", "txt");
    addFmtPlot("X2 Stats Size", "x2tlab_size", ".8", "txt");
    addFmtPlot("X2 Label Text Weight", "x2lab_weight", ["1", "2", "3", "4", "5"], "txt");
    addFmtPlot("X2 Label Text Size", "x2lab_size", ".8", "txt");
    addFmtPlot("X2 Label Perp Offset", "x2lab_offset", "-.5", "txt");
    addFmtPlot("X2 Label Horiz Align", "x2lab_align", ".5", "txt");
    addFmtPlot("Y2 Values Orientation", "y2tlab_orient", ["1", "3"], "txt");
    addFmtPlot("Y2 Values Perp Offset", "y2tlab_perp", ".5", "txt");
    addFmtPlot("Y2 Values Horiz Align", "y2tlab_horiz", ".5", "txt");
    addFmtPlot("Y2 Values Size", "y2tlab_size", "1", "txt");
    addFmtPlot("Y2 Label Text Weight", "y2lab_weight", ["1", "2", "3", "4", "5"], "txt");
    addFmtPlot("Y2 Label Text Size", "y2lab_size", "1", "txt");
    addFmtPlot("Y2 Label Perp Offset", "y2lab_offset", "1", "txt");
    addFmtPlot("Y2 Label Horiz Align", "y2lab_align", ".5", "txt");
    addFmtPlot("Legend Text Size", "legend_size", ".8", "txt");
    addFmtPlot("Legend Box Type", "legend_box", ["o", "n"], "txt");
    addFmtPlot("Legend Box Position", "legend_inset", "c(0, -.25)", "txt");
    addFmtPlot("Legend # of Columns", "legend_ncol", "3", "txt");
    addFmtPlot("Caption Text Weight", "caption_weight", ["1", "2", "3", "4", "5"], "txt");
    addFmtPlot("Caption Text Color", "caption_col", "#333333FF", "txt");
    addFmtPlot("Caption Text Size", "caption_size", ".8", "txt");
    addFmtPlot("Caption Perp Offset", "caption_offset", "3", "txt");
    addFmtPlot("Caption Horiz Align", "caption_align", "0", "txt");
    addFmtPlot("Box Plot Points", "box_pts", ["FALSE", "TRUE"], "txt");
    addFmtPlot("Box Plot Show Outliers", "box_outline", ["TRUE", "FALSE"], "txt");
    addFmtPlot("Box Plot Box Width", "box_boxwex", ".2", "txt");
    addFmtPlot("Box Plot Show Notches", "box_notch", ["TRUE", "FALSE"], "txt");
    addFmtPlot("Box Plot Show Avg", "box_avg", ["FALSE", "TRUE"], "txt");
    addFmtPlot("Reliability Event Histogram", "rely_event_hist", ["TRUE", "FALSE"], "txt");
    addFmtPlot("Conf Interval Alpha", "ci_alpha", ".05", "txt");
    addFmtPlot("Ens Sprd/Skill Pts", "ensss_pts", "-1", "txt");
    addFmtPlot("Ens Sprd/Skill Pts Disp", "ensss_pts_disp", ["TRUE", "FALSE"], "txt");

    //  initialize the dep list
    var divDep0 = document.getElementById("divDep1").getElementsByTagName("div")[0];
    _listDep1Div.push(divDep0);

    //  initialize the series lists
    _divFieldVal = document.getElementById("divFieldVal");
    fillSelect(document.getElementById("selField"), _listVar);
    addSeries1Div();
    document.getElementById("lnkRemoveFieldVal0").style.display = "none";

    //  initialize the independent variable controls
    fillSelect(document.getElementById("selIndyVar"), _listIndyVar);

    //  build the series formatting controls
    buildSeriesDiv();
    setFmtSeriesMod(0, "false");

    //  update the agg_stat controls
    updateAggStat();

    //  initialize the database list and controls
    var strDBLoad = document.getElementById("spanDBLoad").innerHTML;
    if ("" != strDBLoad) {
        _strDBCon = strDBLoad;
        document.getElementById("selDB").style.display = "none";
        debug("onLoad() - loading single database: " + _strDBCon + "\n\n");
        listFcstVar1Req(0);
    } else {
        listDBReq();
        var txtInitXML = document.getElementById("txtInitXML");
        document.getElementById("selTemplate").options[0].selected = true;
        if ("" != txtInitXML.value) {
            loadInitXML(txtInitXML.value);
        }
    }

}

function openAddDiffCurveDialog() {
    $("#addDiffCurveDialogForm").dialog("open");
}


/**
 * Button handlers that call the server to clear/list the <list_val> and <list_stat>
 * caches
 */
function listValClearCacheReq() {
    sendRequest("POST", "<list_val_clear_cache/>", nullResp);
    clearControls();
}
function listValCacheKeysReq() {
    sendRequest("POST", "<list_val_cache_keys/>", nullResp);
    clearControls();
}
function listStatClearCacheReq() {
    sendRequest("POST", "<list_stat_clear_cache/>", nullResp);
    clearControls();
}
function listStatCacheKeysReq() {
    sendRequest("POST", "<list_stat_cache_keys/>", nullResp);
    clearControls();
}
function startDebugOutput() {
    isDebug = true;
}
function stopDebugOutput() {
    isDebug = false;
}


/**
 * Search the specified div list for the member with the specified id and return
 * its index. The div id is determined from the value of the div input with the
 * specified index.
 */
function findDivId(listDiv, intDivId, intInputIndex) {
    var intIndex = -1;
    for (i in listDiv) {
        var intIdCur = listDiv[i].getElementsByTagName("input")[intInputIndex].value;
        if (intDivId == intIdCur) {
            intIndex = i;
        }
    }
    return intIndex;
}

/**
 * When the user changes selected plot data type, update the lists of variables
 * appropriately and reset the controls.
 */
function updatePlotData() {

    //  update the data members and lists accordingly
    var strPlotData = getSelected(document.getElementById("selPlotData"))[0];
    var strTmpl = getSelected(document.getElementById("selTemplate"))[0];
    if (strPlotData == "Stat") {
        if (strTmpl == "rhist") {
            _strPlotData = "rhist";
        }
        else if (strTmpl == "roc") {
            _strPlotData = "roc";
        }
        else if (strTmpl == "rely") {
            _strPlotData = "rely";
        }
        else if (strTmpl == "ens_ss") {
            _strPlotData = "ensss";
        }
        else {
            _strPlotData = "stat";
        }
        _listVar = ( _intTmpl != TMPL_ENS_SS ? _listVarStat : _listVarSpc );
        _listIndyVar = _listIndyVarStat;
        document.getElementById("ratio_stats").style.display = "none";
        document.getElementById("aggStats").style.display = "block";
        document.getElementById("chkCalcStat").style.display = "inline";
        document.getElementById("spanCalcStat").style.display = "inline";

    } else if (strPlotData == "MODE") {
        _strPlotData = "mode";
        _listVar = _listVarMode;
        _listIndyVar = _listIndyVarMode;
        document.getElementById("ratio_stats").style.display = "block";
        document.getElementById("aggStats").style.display = "none";
        document.getElementById("chkCalcStat").style.display = "none";
        document.getElementById("spanCalcStat").style.display = "none";

    }
    clearControls();
}

/**
 * Determine if the input statistic is a MODE statistic and return true if so,
 * false otherwise.
 */
function isModeStat(stat) {
    return (
            (null != stat.match(/^\w+_[FODA]?[SCA][MUA]$/)) ||
                    (null != stat.match(/^RATIO_.+/)) ||
                    (null != stat.match(/^AREARAT_.+/)) ||
                    (null != stat.match(/^OBJ.+/))
            );
}

/**
 * Clear all variable/value controls and reset the select lists to the currently
 * selected lists of fcst_var and variables.
 */
function clearControls() {

    //  reset the selected template
    //var strTemplate = getSelected( document.getElementById("selTemplate") )[0];


    //  for specialized plot templates, clear the <plot_fix> controls and return
    if (isTmplSpc()) {

        //  reset the fixed values
        while (0 < _listFixSpcDiv.length) {
            removeFixSpcDiv(_listFixSpcDiv[0].getElementsByTagName("input")[1].value);
        }
        //listFcstVar1Req(0);
        return;
    }

    //  reset the dep stat controls
    var intDepId = _listDep1Div[0].getElementsByTagName("input")[1].value;
    clearDepStat(intDepId);
    while (1 < _listDep1Div.length) {
        removeDep1Var(_listDep1Div[1].getElementsByTagName("input")[1].value);
    }
    while (0 < _listDep2Div.length) {
        removeDep2Var(_listDep2Div[0].getElementsByTagName("input")[1].value);
    }
    listFcstVar1Req(intDepId);
    _listDep1Div[0].getElementsByTagName("td")[6].style.display = "none";
    _listDep1Div[0].getElementsByTagName("td")[7].style.display = "none";
    _listDep1Div[0].getElementsByTagName("td")[8].style.display = "none";

    //  reset the series controls
    while (0 < _listSeries1Div.length) {
        removeSeries1Div(_listSeries1Div[0].getElementsByTagName("input")[1].value);
    }
    while (0 < _listSeries2Div.length) {
        removeSeries2Div(_listSeries2Div[0].getElementsByTagName("input")[1].value);
    }

    //  reset the select field variable list
    var selField = document.getElementById("selField");
    clearSelect(selField);
    fillSelect(selField, _listVar);
    addSeries1Div();
    _listSeries1Div[0].getElementsByTagName("span")[1].style.display = "none";

    //  reset the fixed values
    while (0 < _listFixDiv.length) {
        removeFixDiv(_listFixDiv[0].getElementsByTagName("input")[1].value);
    }

    //  reset the agg_stat controls
    var divAggStat = document.getElementById("divAggStat");
    divAggStat.getElementsByTagName("input")[0].checked = false;
    updateAggStat();

    //  reset the indep controls
    var selIndyVar = document.getElementById("selIndyVar");
    clearSelect(selIndyVar);
    fillSelect(selIndyVar, _listIndyVar);
    clearIndyVal();

    //  populate the fcst_var list
    listFcstVar1Req(0);


}

/**
 * The specified td element is assumed to contain the standard formatting
 * control structure, and the setting XML tag name is extracted and returned.
 */
function getFmtTag(tdFmt) {
    var strRet = "";
    var listTd = tdFmt.getElementsByTagName("td");
    if (1 < listTd.length) {
        strRet = listTd[2].innerHTML;
    }
    return strRet;
}

/**
 * The specified td element is assumed to contain the standard formatting
 * control structure, and the setting control value is extracted and returned.
 */
function getFmtVal(tdFmt) {
    if (!tdFmt) {
        alert("nit")
    }
    var strVal = "";
    var txtVal = tdFmt.getElementsByTagName("input")[0];
    var boolTxt = ( undefined != txtVal && "none" != txtVal.style.display );
    var selVal = tdFmt.getElementsByTagName("select")[0];
    if (boolTxt) {
        strVal = txtVal.value;
    }
    else {
        strVal = getSelected(selVal)[0];
    }
    return strVal;
}

/**
 * Set the label and tag of the formatting controls in the specified td element
 * to the specified values
 */
function setFmtLabelTag(tdFmt, label, tag) {
    var listTd = tdFmt.getElementsByTagName("td");
    if (1 < listTd.length) {
        listTd[0].innerHTML = label;
        listTd[2].innerHTML = tag;
    }
}

/**
 * Set the value of the formatting control in the specified td element to the
 * specified value
 */
function setFmtVal(tdFmt, val) {
    var txtVal = tdFmt.getElementsByTagName("input")[0];
    var boolTxt = ( undefined != txtVal && "none" != txtVal.style.display );
    if (boolTxt) {
        txtVal.value = val;
    }
    else {
        setSelected(tdFmt.getElementsByTagName("select")[0], val);
    }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Template Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Determine if the specified template type is one of the specialized plot
 * templates and return true if so, false otherwise.  Default input is the
 * current _intTmpl setting.
 */
function isTmplSpc() {
    return (TMPL_RHIST == _intTmpl ||
            TMPL_ROC == _intTmpl ||
            TMPL_RELY == _intTmpl);
}

/**
 * When the plot template is switched, configure the visibility of the controls
 */
function updateTmpl() {

    //  update the template type data member
    var strTmpl = getSelected(document.getElementById("selTemplate"))[0];
    if (null != strTmpl.match(/^series_plot$/)) {
        _intTmpl = TMPL_SERIES_PLOT;
    }
    else if (null != strTmpl.match(/^bar_plot$/)) {
        _intTmpl = TMPL_BAR_PLOT;
    }
    else if (null != strTmpl.match(/^box_plot$/)) {
        _intTmpl = TMPL_BOX_PLOT;
    }
    else if (null != strTmpl.match(/^rhist$/)) {
        _intTmpl = TMPL_RHIST;
    }
    else if (null != strTmpl.match(/^roc$/)) {
        _intTmpl = TMPL_ROC;
    }
    else if (null != strTmpl.match(/^rely$/)) {
        _intTmpl = TMPL_RELY;
    }
    else if (null != strTmpl.match(/^ens_ss$/)) {
        _intTmpl = TMPL_ENS_SS;
    }


    //  default visibility settings for the series_plot template
    var boolY1 = true;
    var boolDep1 = true;
    var boolY2 = true;
    var boolY2NA = false;
    var boolY2Fmt = true;
    var boolFix = true;
    var boolFixSpc = false;
    var boolIndy = true;
    var boolAggStat = true;
    var boolAggStatNA = false;
    var boolCalcStat = true;
    var boolCalcStatNA = false;
    var boolRocCalc = false;
    var boolHistType = false;

    //  for box_plot and bar_plot templates, hide the Y2 controls and agg_stat
    if (TMPL_BOX_PLOT == _intTmpl) {
        boolY2NA = false;
        boolAggStatNA = true;
        boolY2Fmt = true;
    } else if (TMPL_BAR_PLOT == _intTmpl) {
        boolY2NA = true;
        boolAggStatNA = true;
        boolY2Fmt = false;
    } else if (isTmplSpc()) {
        boolY1 = false;
        boolY2 = false;
        boolY2Fmt = false;
        boolFix = false;
        boolFixSpc = true;
        boolIndy = false;
        boolAggStat = false;
        boolCalcStat = false;
        boolRocCalc = (TMPL_ROC == _intTmpl);
        boolHistType = (TMPL_RHIST == _intTmpl);
    } else if (TMPL_ENS_SS == _intTmpl) {
        boolDep1 = false;
        boolY2 = false;
        boolY2NA = true;
        boolIndy = false;
        boolAggStat = false;
        boolAggStatNA = true;
        boolCalcStat = false;
        boolFix = false;
        boolFixSpc = true;
    }

    //  configure the visibility of the Y1, Y2, fix and indy controls
    document.getElementById("tdY1").style.display = boolY1 ? "table-cell" : "none";
    document.getElementById("divDep1").style.display = boolDep1 ? "block" : "none";
    document.getElementById("tdY2").style.display = boolY2 ? "table-cell" : "none";
    document.getElementById("spanY2NA").style.display = boolY2NA ? "inline" : "none";
    document.getElementById("divDep2").style.display = boolY2NA ? "none" : "inline";
    document.getElementById("divSeries2").style.display = boolY2NA ? "none" : "inline";
    document.getElementById("divFix").style.display = boolFix ? "inline" : "none";
    document.getElementById("divFixSpc").style.display = boolFixSpc ? "inline" : "none";
    document.getElementById("tdIndy").style.display = boolIndy ? "table-cell" : "none";

    //  configure the visibility of the agg_stat controls
    document.getElementById("tdAggStat").style.display = boolAggStat ? "table-cell" : "none";
    document.getElementById("divAggStat").getElementsByTagName("input")[0].checked = false;
    updateAggStat();
    document.getElementById("spanAggStatNA").style.display = boolAggStatNA ? "inline" : "none";
    document.getElementById("chkAggStat").style.display = boolAggStatNA ? "none" : "inline";
    document.getElementById("spanAggStat").style.display = boolAggStatNA ? "none" : "inline";

    //  configure the visibility of the calc_stat controls
    document.getElementById("tdCalcStat").style.display = boolCalcStat ? "table-cell" : "none";
    document.getElementById("divCalcStat").getElementsByTagName("input")[0].checked = false;
    updateCalcStat();
    document.getElementById("spanCalcStatNA").style.display = boolCalcStatNA ? "inline" : "none";
    document.getElementById("chkCalcStat").style.display = boolCalcStatNA ? "none" : "inline";
    document.getElementById("spanCalcStat").style.display = boolCalcStatNA ? "none" : "inline";

    //  configure the visibility of the calc_stat controls
    document.getElementById("tdRocCalc").style.display = boolRocCalc ? "table-cell" : "none";

    //  configure the visibility of the histogram type
    document.getElementById("tdHistType").style.display = boolHistType ? "table-cell" : "none";

    //  configure the visibility of the plot formatting controls
    var listFmtAxis = document.getElementById("divFmtAxis").getElementsByTagName("td");
    listFmtAxis[4].style.display = boolY2Fmt ? "inline" : "none";
    listFmtAxis[5].style.display = boolY2Fmt ? "inline" : "none";
    listFmtAxis[6].style.display = boolY2Fmt ? "inline" : "none";
    listFmtAxis[7].style.display = boolY2Fmt ? "inline" : "none";

    if (_intTmpl == TMPL_SERIES_PLOT || _intTmpl == TMPL_BAR_PLOT || _intTmpl == TMPL_BOX_PLOT) {
        document.getElementById("btnFmtAddDifferenceCurve").style.display = "inline";
    } else {
        document.getElementById("btnFmtAddDifferenceCurve").style.display = "none";
    }

    if (isTmplSpc()) {
        buildSeriesDivSpc();
        updateFmtPlot();
    } else {
        buildSeriesDiv();
    }

    updatePlotData();
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Dependent Variable Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function addDep1() {
    addDep(1);
}
function removeDep1Var(intDepId) {
    removeDepVar(1, intDepId);
}
function listFcstVar1Req(intDepId) {
    listFcstVarReq(intDepId, listFcstVar1Resp);
}
function listFcstVar1Resp(strResp) {
    selectFieldResp(strResp, _listDep1Div, 1, 0, false, false);
}

function addDep2() {
    addDep(2);
}
function removeDep2Var(intDepId) {
    removeDepVar(2, intDepId);
}
function listFcstVar2Req(intDepId) {
    listFcstVarReq(intDepId, listFcstVar2Resp);
}
function listFcstVar2Resp(strResp) {
    selectFieldResp(strResp, _listDep2Div, 1, 0, false, false);
}

/**
 * Create a GUI control cluster for specifying a dependent variable fcst_var and
 * stat(s)
 */
function addDep(intY) {

    var listDepDiv = (1 == intY ? _listDep1Div : _listDep2Div);

    //  clone the dependent variable controls
    var intDepId = _intDepIdNext++;
    var divDep = _listDep1Div[0].cloneNode(true);

    //  update the components of the cloned fixed value controls
    divDep.id = "divDep" + intDepId;
    var selFcstVar = divDep.getElementsByTagName("select")[0];
    selFcstVar.id = "selFcstVar" + intDepId;
    selFcstVar.setAttribute("onchange", "javascript:clearDepStat(" + intDepId + ")");
    if (_boolIE) {
        selFcstVar.attachEvent("onchange", new Function("clearDepStat(" + intDepId + ")"));
    }
    var btnFcstVar1 = divDep.getElementsByTagName("input")[0];
    btnFcstVar1.setAttribute("onclick", "javascript:selectFcstVarReq(" + intDepId + ",this)");
    if (_boolIE) {
        btnFcstVar1.attachEvent("onclick", new Function("selectFcstVarReq(" + intDepId + ", this)"));
    }

    var btnFcstVar2 = divDep.getElementsByTagName("input")[2];
    btnFcstVar2.setAttribute("onclick", "javascript:selectFcstVarReq(" + intDepId + ",this)");
    if (_boolIE) {
        btnFcstVar2.attachEvent("onclick", new Function("selectFcstVarReq(" + intDepId + ", this)"));
    }

    var selStat = divDep.getElementsByTagName("select")[1];
    clearSelect(selStat);
    selStat.style.display = "none";
    selStat.id = "selStat" + intDepId;
    selStat.setAttribute("onchange", "javascript:updateDepStat(" + intDepId + ")");
    if (_boolIE) {
        selStat.attachEvent("onchange", new Function("updateDepStat(" + intDepId + ")"));
    }
    divDep.getElementsByTagName("td")[6].style.display = "none";
    divDep.getElementsByTagName("td")[7].style.display = "none";
    divDep.getElementsByTagName("td")[8].style.display = "none";
    var chkDiff = divDep.getElementsByTagName("input")[3];
    chkDiff.setAttribute("onclick", "javascript:modeStatDiffChk(" + intDepId + ")");
    if (_boolIE) {
        chkDiff.attachEvent("onclick", new Function("modeStatDiffChk(" + intDepId + ")"));
    }

    divDep.getElementsByTagName("input")[4].setAttribute("onclick", "javascript:updateDepStat(" + intDepId + ")");
    if (_boolIE) {
        divDep.getElementsByTagName("input")[4].attachEvent("onclick", new Function("updateDepStat(" + intDepId + ")"));
    }

    divDep.getElementsByTagName("input")[5].setAttribute("onclick", "javascript:updateDepStat(" + intDepId + ")");
    if (_boolIE) {
        divDep.getElementsByTagName("input")[5].attachEvent("onclick", new Function("updateDepStat(" + intDepId + ")"));
    }

    divDep.getElementsByTagName("input")[6].setAttribute("onclick", "javascript:updateDepStat(" + intDepId + ")");
    if (_boolIE) {
        divDep.getElementsByTagName("input")[6].attachEvent("onclick", new Function("updateDepStat(" + intDepId + ")"));
    }

    divDep.getElementsByTagName("input")[7].setAttribute("onclick", "javascript:updateDepStat(" + intDepId + ")");
    if (_boolIE) {
        divDep.getElementsByTagName("input")[7].attachEvent("onclick", new Function("updateDepStat(" + intDepId + ")"));
    }

    divDep.getElementsByTagName("input")[8].setAttribute("onclick", "javascript:updateDepStat(" + intDepId + ")");
    if (_boolIE) {
        divDep.getElementsByTagName("input")[8].attachEvent("onclick", new Function("updateDepStat(" + intDepId + ")"));
    }

    divDep.getElementsByTagName("input")[9].setAttribute("onclick", "javascript:updateDepStat(" + intDepId + ")");
    if (_boolIE) {
        divDep.getElementsByTagName("input")[9].attachEvent("onclick", new Function("updateDepStat(" + intDepId + ")"));
    }

    var lnkDep = divDep.getElementsByTagName("a")[0];
    lnkDep.setAttribute("onclick", "javascript:removeDep" + intY + "Var(" + intDepId + ")");
    if (_boolIE) {
        lnkDep.attachEvent("onclick", new Function("removeDep" + intY + "Var(" + intDepId + ")"));
    }
    divDep.getElementsByTagName("span")[1].style.display = "inline";
    divDep.getElementsByTagName("input")[1].value = "" + intDepId;

    //  add the new fixed variable value section to the page
    listDepDiv.push(divDep);
    var divDepParent = document.getElementById("divDep" + intY);
    var divImgParent = document.getElementById("imgDep" + intY);
    console.log("addDep(" + intY + ")\n divDepParent: " + divDepParent + " divImgParent: " + divImgParent);
    divDepParent.insertBefore(divDep, divImgParent);

    //  ensure the first remove link is visible
    listDepDiv[0].getElementsByTagName("span")[1].style.display = "inline";
}

/**
 * Remove the specified dep div from the list of dependent variable controls
 */
function removeDepVar(intY, intDepId) {
    var listDepDiv = (1 == intY ? _listDep1Div : _listDep2Div);
    removeFieldValDiv(intDepId, listDepDiv, 1);
    if (1 == intY && 1 == listDepDiv.length) {
        listDepDiv[0].getElementsByTagName("span")[1].style.display = "none";
    }
    buildSeriesDiv();
}

/**
 * List the fcst_var database field values, and populate the dependent variable
 * fcst_var select with the results
 */
function listFcstVarReq(intDepId, fnListFcstVarResp) {
    sendRequest("POST",
            "<list_val>" +
                    "<id>" + intDepId + "</id>" +
                    "<" + _strPlotData + "_field>FCST_VAR</" + _strPlotData + "_field>" +
                    "</list_val>",
            fnListFcstVarResp);
}

/**
 * List the statistics available for the specified forecast variable and
 * populate the statistics select with the results
 */
function selectFcstVarReq(intId, el) {

    //  query the database for stat_header stats, if appropriate
    if (_strPlotData == "stat") {
        var selFcstVar = document.getElementById("selFcstVar" + intId);
        document.getElementById("selStat" + intId).multiple = "multiple";
        sendRequest("POST",
                "<list_stat>" +
                        "<id>" + intId + "</id>" +
                        "<" + _strPlotData + "_fcst_var>" +
                        selFcstVar.options[selFcstVar.selectedIndex].text +
                        "</" + _strPlotData + "_fcst_var>" +
                        "</list_stat>",
                selectFcstVarResp);
    }

    //  otherwise, use the static list of mode stats
    else {
        var selFcstVar = document.getElementById("selStat" + intId);
        var isRatioStat = false;
        if (el) {
            if (el.value.indexOf("Ratio") != -1 || el.value.indexOf("ratio") != -1) {
                isRatioStat = true;
            }
        } else {
            //from load XML
            var stat = _strInitXML.match(/<stat>(\w+)<\/stat>/)[1];
            var index = indexOf.call(_listStatModelRatio, stat); // 1
            if (index > -1) {
                isRatioStat = true;
            }
        }
        if (isRatioStat) {
            fillSelect(selFcstVar, _listStatModelRatio);
            selFcstVar.multiple = "multiple";
            var divDep = getDepDiv(intId);
            //  toggle the visibility of the checkbox table cells
            divDep.getElementsByTagName("span")[0].style.display = "none";
            divDep.getElementsByTagName("td")[6].style.display = "none";
            divDep.getElementsByTagName("td")[7].style.display = "none";
            divDep.getElementsByTagName("td")[8].style.display = "none";

        } else {
            fillSelect(selFcstVar, _listStatMode);
            selFcstVar.multiple = "";
        }

        selFcstVar.style.display = "inline";
    }
}
function selectFcstVarResp(strResp) {

    //  parse the response
    var resp = parseListValResp(strResp, "stat");
    if (null == resp) {
        return;
    }

    //  populate and display the stats select control
    var selFcstVar = document.getElementById("selStat" + resp.id);
    fillSelect(selFcstVar, resp.vals);
    selFcstVar.style.display = "inline";
}

/**
 * Build an XML criteria string for a <list_val> command which contains the list
 * of currently selected dependent variable fcst_var values
 */
function buildFcstVarCrit(intY) {

    //  determine the list of dep divs to consider
    var listDepDiv;
    if (1 == intY) {
        listDepDiv = _listDep1Div;
    }
    else if (2 == intY) {
        listDepDiv = _listDep2Div;
    }
    else {
        listDepDiv = _listDep1Div.concat(_listDep2Div);
    }

    //  add the fcst_var from each dep div to the list
    var strFixCrit = "<field name=\"FCST_VAR\">";
    for (i in listDepDiv) {
        var selFcstVar = listDepDiv[i].getElementsByTagName("select")[0];
        strFixCrit += "<val>" + escapeXml(selFcstVar.options[selFcstVar.selectedIndex].text) + "</val>";
    }
    strFixCrit += "</field>";
    return strFixCrit;
}

function buildFcstVarStatCrit(intY) {

    //  determine the list of dep divs to consider
    var listDepDiv;
    if (1 == intY) {
        listDepDiv = _listDep1Div;
    }
    else if (2 == intY) {
        listDepDiv = _listDep2Div;
    }
    else {
        listDepDiv = _listDep1Div.concat(_listDep2Div);
    }

    //  for each fcst_var in the dep div list, build a list of stats
    var strFixCrit = "<stat>";
    for (i in listDepDiv) {
        var selFcstVar = listDepDiv[i].getElementsByTagName("select")[0];
        var listStat = getSelected(listDepDiv[i].getElementsByTagName("select")[1]);
        strFixCrit += "<fcst_var name=\"" + selFcstVar.options[selFcstVar.selectedIndex].text + "\">";
        for (intStat in listStat) {
            strFixCrit += "<val>" + listStat[intStat] + "</val>";
        }
        strFixCrit += "</fcst_var>";
    }
    strFixCrit += "</stat>";
    return strFixCrit;
}

/**
 * Clears the dep stat select control of the specified index when a change is
 * made to the fcst_var select
 */
function clearDepStat(intIndex) {
    var selStat = document.getElementById("selStat" + intIndex);
    clearSelect(selStat);
    selStat.style.display = "none";
    var divDep = getDepDiv(intIndex);
    //  toggle the visibility of the checkbox table cells
    divDep.getElementsByTagName("span")[0].style.display = "none";
    divDep.getElementsByTagName("td")[6].style.display = "none";
    divDep.getElementsByTagName("td")[7].style.display = "none";
    divDep.getElementsByTagName("td")[8].style.display = "none";
}

/**
 * When a dep stat selection is changed, this method is called to handle the
 * toggling of the mode checkbox visibility and the updating of the series
 * format controls.
 */
function updateDepStat(id) {
    var divDep = getDepDiv(id);

    //  determine the visibility of the mode checkboxes
    var listStatSel = getSelected(divDep.getElementsByTagName("select")[1]);
    var boolVisMode = "mode" == _strPlotData && 0 < listStatSel.length &&
            null == listStatSel[0].match(/^RATIO_.+/) &&
            null == listStatSel[0].match(/^AREARAT_.+/) &&
            null == listStatSel[0].match(/^OBJ.+/);
    var boolSingle = (-1 < listSearch(listStatSel[0], _listStatModeSingle));
    var boolAcov = null != listStatSel[0].match(/^ACOV$/);
    var boolVisFO = boolVisMode && boolSingle;
    var boolVisFODif = boolVisFO && !boolAcov;
    var boolVisSC = boolVisMode && !boolAcov;
    var boolVisMU = boolVisMode && !boolAcov;

    //  toggle the visibility of the checkbox table cells
    divDep.getElementsByTagName("span")[0].style.display = boolVisMode ? "inline" : "none";
    divDep.getElementsByTagName("td")[6].style.display = boolVisFO ? "table-cell" : "none";
    divDep.getElementsByTagName("td")[7].style.display = boolVisSC ? "table-cell" : "none";
    divDep.getElementsByTagName("td")[8].style.display = boolVisMU ? "table-cell" : "none";

    //  change the state of the Difference checkbox, if appropriate
    divDep.getElementsByTagName("input")[3].disabled = !boolVisFODif;
    if (!boolVisFODif) {
        divDep.getElementsByTagName("input")[3].checked = false;
        divDep.getElementsByTagName("input")[4].disabled = false;
        divDep.getElementsByTagName("input")[5].disabled = false;
    }
    //divDep.getElementsByTagName("input")[6].checked = false;

    buildSeriesDiv();
}

function modeStatDiffChk(id) {
    var divDep = getDepDiv(id);

    var boolDiff = divDep.getElementsByTagName("input")[2].checked;
    divDep.getElementsByTagName("input")[4].checked = true;
    divDep.getElementsByTagName("input")[4].disabled = boolDiff;
    divDep.getElementsByTagName("input")[5].checked = true;
    divDep.getElementsByTagName("input")[5].disabled = boolDiff;
    updateDepStat(id);
}

/**
 * Search the lists of dep1 and dep2 divs for the one whose value matches the
 * input value and return it
 */
function getDepDiv(id) {
    var listDepDiv = _listDep1Div.concat(_listDep2Div);
    var intIndex = findDivId(listDepDiv, id, 1);
    if (0 > intIndex) {
        debug("getDepDiv() - ERROR: index for div id " + resp.id + " not found\n\n");
        return;
    }
    return listDepDiv[intIndex];
}

/**
 * Parse the id of the specified div and return its id number
 */
function getDivDepId(div) {
    return ( null != (listId = div.id.match(/divDep(\d+)/)) ? listId[1] : 0 );
}
function getDivFieldValId(div) {
    return ( null != (listId = div.id.match(/divFieldVal(\d+)/)) ? listId[1] : 0 );
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Field Value Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Create a field val div of the specified category and add it to the from and
 * to the input controls list
 */
function addFieldValDiv(category, listDiv) {

    //  use the next field val id
    var intId = _intFieldValIdNext++;

    //  clone the field value div and update the controls
    var divFieldVal = _divFieldVal.cloneNode(true);
    divFieldVal.id = "divFieldVal" + intId;
    var selVar = divFieldVal.getElementsByTagName("select")[0];
    selVar.id = "selFieldVal" + intId;
    selVar.setAttribute("onchange", "javascript:clearFieldVal(" + intId + ")");
    if (_boolIE) {
        selVar.attachEvent("onchange", new Function("clearFieldVal(" + intId + ")"));
    }
    var btnFieldVal = divFieldVal.getElementsByTagName("input")[0];
    btnFieldVal.setAttribute("onclick", "javascript:select" + category + "VarReq(" + intId + ")");
    if (_boolIE) {
        btnFieldVal.attachEvent("onclick", new Function("select" + category + "VarReq(" + intId + ")"));
    }
    var selVal = divFieldVal.getElementsByTagName("select")[1];
    clearSelect(selVal);
    selVal.style.display = "none";
    selVal.id = "selVal" + intId;
    var tdFieldMove = divFieldVal.getElementsByTagName("td")[1];
    tdFieldMove.id = "tdFieldMove" + intId;
    tdFieldMove.style.display = "none";
    var tdSelValGroup = divFieldVal.getElementsByTagName("td")[2];
    tdSelValGroup.id = "tdSelValGroup" + intId;
    tdSelValGroup.getElementsByTagName("label")[0].innerHTML= "Group_" + intId;
    tdSelValGroup.style.display = "none";


    var imgFieldUp = divFieldVal.getElementsByTagName("img")[0];

    imgFieldUp.setAttribute("onclick", "javascript:move" + category + "FieldUp(" + intId + ")");
    if (_boolIE) {
        imgFieldUp.attachEvent("onclick", new Function("move" + category + "FieldUp(" + intId + ")"));
    }
    var imgFieldDown = divFieldVal.getElementsByTagName("img")[1];
    imgFieldDown.setAttribute("onclick", "javascript:move" + category + "FieldDown(" + intId + ")");
    if (_boolIE) {
        imgFieldDown.attachEvent("onclick", new Function("move" + category + "FieldDown(" + intId + ")"));
    }
    divFieldVal.getElementsByTagName("span")[1].id = "lnkRemoveFieldVal" + intId;
    var lnkRemove = divFieldVal.getElementsByTagName("a")[0];
    lnkRemove.setAttribute("onclick", "javascript:remove" + category + "Div(" + intId + ")");
    if (_boolIE) {
        lnkRemove.attachEvent("onclick", new Function("remove" + category + "Div(" + intId + ")"));
    }
    divFieldVal.getElementsByTagName("input")[1].value = "" + intId;
    divFieldVal.style.display = "inline";


    //  add the new div to the input controls list and add it to the form
    listDiv.push(divFieldVal);
    document.getElementById("div" + category).insertBefore(divFieldVal, document.getElementById("img" + category));
}

/**
 * Remove the field val div with the specified id from the from and the controls
 * list. The index of the hidden id field is specified by intInputId.
 */
function removeFieldValDiv(intId, listDiv, intInputId) {

    //  attempt to find the specified div, and if not found, bail
    var intIndex = findDivId(listDiv, intId, intInputId);
    if (0 > intIndex) {
        debug("removeFieldValDiv() - WARNING: div " + intId + " not found\n\n");
        return;
    }

    //  remove the specified div from the list and hide it
    var divFieldVal = listDiv[intIndex];
    listDiv.splice(intIndex, 1);
    divFieldVal.style.display = "none";

}

/**
 * Build a list_val server request for the field val with the specified id in
 * the specified controls list. The request includes the fixed value criteria up
 * to the specified index. The response xml is passed to the specified response
 * function. If the input control flag is set to -1, the criteria for rhist is
 * used. Otherwise, if the control flag is 1 or 2, the criteria for only the
 * corresponding axis only is used.
 */
function selectFieldReq(intId, listDiv, intFixEnd, fnResp, intY) {

    //  attempt to find the specified div, and if not found, bail
    var intIndex = findDivId(listDiv, intId, 1);
    if (0 > intIndex) {
        debug("selectFieldReq() - ERROR: div " + intId + " not found\n\n");
        return;
    }

    //  gather the criteria
    var strFcstVarCrit = "";
    var strFixCrit = "";
    if (-1 == intY) {
        strFixCrit = buildFixSpcCrit(intFixEnd);
    } else {
        if (1 == intY || 2 == intY) {
            strFcstVarCrit = buildFcstVarStatCrit(intY);
        }
        else {
            strFcstVarCrit = buildFcstVarStatCrit();
        }
        strFixCrit = buildFixCrit(intFixEnd);
    }

    //  build a list_val request for the selected field
    var selField = listDiv[intIndex].getElementsByTagName("select")[0];
    var strField = selField.options[selField.selectedIndex].text;
    sendRequest("POST",
            "<list_val>" +
                    "<id>" + intId + "</id>" +
                    "<" + _strPlotData + "_field>" + strField + "</" + _strPlotData + "_field>" +
                    strFcstVarCrit +
                    strFixCrit +
                    "</list_val>",
            fnResp);
}

/**
 * Handle the specified <list_val> response XML (strResp), populating the div
 * from the input list with the id contained in the response <id>. The div id is
 * determined by examining the hidden field with the specified index
 * (intIdIndex). The select control of the specified index (intSelIndex) will be
 * populated. The field ordering arrows will be displayed as specified.
 */
function selectFieldResp(strResp, listDiv, intIdIndex, intSelIndex, showArrows,showGroup ) {

    //  parse the response
    var resp = parseListValResp(strResp, "val");
    if (null == resp) {
        return;
    }

    //  retrieve and validate the div from the input div list
    var intIndex = findDivId(listDiv, resp.id, intIdIndex);
    if (0 > intIndex) {
        debug("selectFieldResp() - ERROR: index for div id " + resp.id + " not found\n\n");
        return;
    }

    //  add the field values to the value select list
    var selVal = listDiv[intIndex].getElementsByTagName("select")[intSelIndex];
    selVal.style.display = "inline";
    if (showArrows) {
        listDiv[intIndex].getElementsByTagName("td")[1].style.display = "table-cell";
    }
    if(showGroup){
        listDiv[intIndex].getElementsByTagName("td")[2].style.display = "table-cell";

    }
    fillSelect(selVal, resp.vals);
    if (resp.vals.length == 1 && resp.vals[0].length == 0) {
        document.getElementById("ratio_stats").style.display = "none";
        document.getElementById("other_stats").style.display = "none";
    } else {
        var strPlotData = getSelected(document.getElementById("selPlotData"))[0];
        document.getElementById("other_stats").style.display = "block";
        if (strPlotData == "Stat") {
            document.getElementById("ratio_stats").style.display = "none";
            document.getElementById("aggStats").style.display = "block";
            document.getElementById("chkCalcStat").style.display = "inline";
            document.getElementById("spanCalcStat").style.display = "inline";
        } else if (strPlotData == "MODE") {
            document.getElementById("ratio_stats").style.display = "block";
            document.getElementById("aggStats").style.display = "none";
            document.getElementById("chkCalcStat").style.display = "none";
            document.getElementById("spanCalcStat").style.display = "none";
        }
    }
}

/**
 * Clears the specified field value select control of the specified index when a
 * change is made to the field var
 */
function clearFieldVal(intId) {
    var selVal = document.getElementById("selVal" + intId);
    clearSelect(selVal);
    selVal.style.display = "none";
    document.getElementById("tdFieldMove" + intId).style.display = "none";
    document.getElementById("tdSelValGroup" + intId).style.display = "none";
}

/**
 * Move the currently selected item in the select value control in the specified
 * list with the specified id up one place. This function will not attempt to do
 * anything if there are fewer than two items in the select list, or if the
 * first item is selected.  The number of spots moved is returned.
 */
function moveFieldUp(listDiv, intId) {

    //  find the selected element, and bail if there is not exactly one
    var selVal = document.getElementById("selVal" + intId);
    var listSel = getSelected(selVal);
    var intSel = selVal.selectedIndex;
    if (2 > selVal.options.length || 1 != listSel.length || intSel == 0) {
        return 0;
    }

    //  move the selected option
    var optMove = document.createElement("option");
    optMove.text = selVal.options[intSel].text;
    selVal.remove(intSel);
    if (_boolIE) {
        selVal.add(optMove, intSel - 1);
    }
    else {
        selVal.add(optMove, selVal.options[intSel - 1]);
    }
    selVal.selectedIndex = intSel - 1;
    return 1;
}

/**
 * Move the currently selected item in the select value control in the specified
 * list with the specified id down one place. This function will not attempt to
 * do anything if there are fewer than two items in the select list, or if the
 * list item is selected.
 */
function moveFieldDown(listDiv, intId) {

    //  find the selected element, and bail if there is not exactly one
    var selVal = document.getElementById("selVal" + intId);
    var listSel = getSelected(selVal);
    var intSel = selVal.selectedIndex;
    if (2 > selVal.options.length || 1 != listSel.length || intSel == selVal.options.length - 1) {
        return;
    }

    //  move the selected option
    var optMove = document.createElement("option");
    optMove.text = selVal.options[intSel].text;
    selVal.remove(intSel);
    if (_boolIE) {
        selVal.add(optMove, intSel >= selVal.options.length - 1 ? null : intSel + 1);
    }
    else {
        selVal.add(optMove, intSel >= selVal.options.length - 1 ? null : selVal.options[intSel + 1]);
    }
    selVal.selectedIndex = intSel + 1;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Series Variable Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Handlers to add and remove a series1 div and process select requests and
 * responses
 */
function addSeries1Div() {
    addSeriesDiv(1);
}
function removeSeries1Div(intId) {
    removeSeriesDiv(1, intId);
}
function selectSeries1VarReq(intId) {
    selectFieldReq(intId, _listSeries1Div, _listFixDiv.length - 1, selectSeries1VarResp, 1);
}
function selectSeries1VarResp(strResp) {
    selectFieldResp(strResp, _listSeries1Div, 1, 1, true, true);
}
function moveSeries1FieldUp(intId) {
    moveFieldUp(_listSeries1Div, intId);
}
function moveSeries1FieldDown(intId) {
    moveFieldDown(_listSeries1Div, intId);
}

/**
 * Handlers to add and remove a series2 div and process select requests and
 * responses
 */
function addSeries2Div() {
    addSeriesDiv(2);
}
function removeSeries2Div(intId) {
    removeSeriesDiv(2, intId);
}
function selectSeries2VarReq(intId) {
    selectFieldReq(intId, _listSeries2Div, _listFixDiv.length - 1, selectSeries2VarResp, 2);
}
function selectSeries2VarResp(strResp) {
    selectFieldResp(strResp, _listSeries2Div, 1, 1, true, true);
}
function moveSeries2FieldUp(intId) {
    moveFieldUp(_listSeries2Div, intId);
}
function moveSeries2FieldDown(intId) {
    moveFieldDown(_listSeries2Div, intId);
}

/**
 * Build and add a series div for the specified series with configured controls
 */
function addSeriesDiv(intSeries) {
    //  determine the appropriate div list
    var listSeriesDiv = (1 == intSeries ? _listSeries1Div : _listSeries2Div);

    //  add a field val div and modify its components for duty as a series div
    addFieldValDiv("Series" + intSeries, listSeriesDiv);
    var intSeriesIndex = listSeriesDiv.length - 1;
    var selVal = listSeriesDiv[ intSeriesIndex ].getElementsByTagName("select")[1];
    selVal.setAttribute("onchange", "javascript:buildSeriesDiv()");
    if (_boolIE) {
        selVal.attachEvent("onchange", new Function("buildSeriesDiv()"));
    }
    for (i in listSeriesDiv) {
        listSeriesDiv[i].getElementsByTagName("span")[1].style.display = "inline";
    }
}

/**
 * Dispose of and hide the series div of the specified series with the specified
 * id
 */
function removeSeriesDiv(intSeries, intId) {
    //  determine the appropriate div list
    var listSeriesDiv = (1 == intSeries ? _listSeries1Div : _listSeries2Div);

    //  dispose of and hide the series div
    removeFieldValDiv(intId, listSeriesDiv, 1);
    if (1 == listSeriesDiv.length) {
        listSeriesDiv[0].getElementsByTagName("span")[1].style.display = "none";
    }
    buildSeriesDiv();
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Fixed Variable Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Handlers to add, remove and populate the fixed variable controls
 */
function addFixVar() {
    addFieldValDiv("Fix", _listFixDiv);
}
function removeFixDiv(intId) {
    removeFieldValDiv(intId, _listFixDiv, 1);
}
function selectFixVarReq(intId) {
    var intIndexCrit = findDivId(_listFixDiv, intId, 1);
    if (0 > intIndexCrit) {
        debug("selectFixVarReq() - ERROR: index for id " + intId + " not found\n");
        return;
    }
    selectFieldReq(intId, _listFixDiv, intIndexCrit - 1, selectFixVarResp);
}
function selectFixVarResp(strResp) {
    selectFieldResp(strResp, _listFixDiv, 1, 1, false, false);
}

/**
 * Construct a string of database field and value criteria that reflects the
 * selected fields and values in the values controls of the input div list
 */
function buildFieldValCrit(listDiv, endIndex) {
    var strCrit = "";
    for (i = 0; i <= endIndex; i++) {
        var divCrit = listDiv[i];
        var selCrit = divCrit.getElementsByTagName("select")[0];
        var strCritCur = "<field name=\"" + selCrit.options[ selCrit.selectedIndex ].text + "\">";
        var listCritVal = getSelected(divCrit.getElementsByTagName("select")[1]);
        for (var j = 0; j < listCritVal.length; j++) {
            strCritCur += "<val>" + escapeXml(listCritVal[j]) + "</val>";
        }
        strCritCur += "</field>";
        if (0 < listCritVal.length) {
            strCrit += strCritCur;
        }
    }
    return strCrit;
}
function buildFixCrit(endIndex) {
    return buildFieldValCrit(_listFixDiv, endIndex);
}
function buildFixSpcCrit(endIndex) {
    return buildFieldValCrit(_listFixSpcDiv, endIndex);
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Specialized Plot Fixed Variable Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Handlers to add, remove and populate the specialized plot fixed variable controls
 */
function addFixSpcVar() {
    //  add the control group for the field value selection
    addFieldValDiv("FixSpc", _listFixSpcDiv);

    //  add rank size to the list of fields
    var selField = _listFixSpcDiv[_listFixSpcDiv.length - 1].getElementsByTagName("select")[0];
    clearSelect(selField);
    if (TMPL_RHIST == _intTmpl) {
        fillSelect(selField, _listVarRhist);
    }
    else {
        fillSelect(selField, _listVarSpc);
    }
}
function removeFixSpcDiv(intId) {
    removeFieldValDiv(intId, _listFixSpcDiv, 1);
}
function selectFixSpcVarReq(intId) {
    var intIndexCrit = findDivId(_listFixSpcDiv, intId, 1);
    if (0 > intIndexCrit) {
        debug("selectFixSpcVarReq() - ERROR: index for id " + intId + " not found\n");
        return;
    }
    selectFieldReq(intId, _listFixSpcDiv, intIndexCrit - 1, selectFixSpcVarResp, -1);
}
function selectFixSpcVarResp(strResp) {
    selectFieldResp(strResp, _listFixSpcDiv, 1, 1, false, false);
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Independent Variable Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Build and run a request for values for the currently selected independent
 * variable and populate the independent variable value list with the results
 */
function selectIndyVarReq() {

    //  build a list_val request for the selected independent field
    var strFcstVarCrit = buildFcstVarStatCrit();
    var strFixCrit = buildFixCrit(_listFixDiv.length - 1);
    var strField = getSelected(document.getElementById("selIndyVar"))[0];
    sendRequest("POST",
            "<list_val>" +
                    "<id>0</id>" +
                    "<" + _strPlotData + "_field>" + strField + "</" + _strPlotData + "_field>" +
                    strFcstVarCrit +
                    strFixCrit +
                    "</list_val>",
            selectIndyVarResp);
}
function selectIndyVarResp(strResp) {

    //  parse the response
    var resp = parseListValResp(strResp, "val");
    if (null == resp) {
        return;
    }

    //  hide all currently display indy val controls
    clearIndyVal();

    //  add a indy val control group for each indy value
    var divIndy = document.getElementById("divIndy");
    var strField = getSelected(document.getElementById("selIndyVar"))[0];
    for (i in resp.vals) {
        var trIndyVal = tabIndyVal.insertRow(tabIndyVal.rows.length);

        //  build a control set for the independent variable value
        var tdIndyChk = trIndyVal.insertCell(0);
        tdIndyChk.appendChild(document.getElementById("spanIndyValChk").cloneNode(true));
        var tdIndyLab = trIndyVal.insertCell(1);
        tdIndyLab.appendChild(document.getElementById("spanIndyValLab").cloneNode(true));
        trIndyVal.getElementsByTagName("span")[1].innerHTML = resp.vals[i];
        trIndyVal.style.display = "table-row";

        //  set the default label
        var strLabel = resp.vals[i];
        if ("FCST_LEAD" == strField) {
            var listParse = strLabel.match(/(\d+)0000$/);
            if (null != listParse) {
                strLabel = listParse[1];
            }
        }
        trIndyVal.getElementsByTagName("input")[1].value = strLabel;
    }
    document.getElementById("spanIndyCheck").style.display = "inline";

    //  update the plot formatting to accommodate date series
    updateFmtPlot();
}

/**
 * Remove all rows of the indy table that contain values
 */
function clearIndyVal() {
    var tabIndyVal = document.getElementById("tabIndyVal");
    while (1 < tabIndyVal.rows.length) {
        tabIndyVal.deleteRow(tabIndyVal.rows.length - 1);
    }
    document.getElementById("spanIndyCheck").style.display = "none";
}

/**
 * Checks or unchecks all indy values, as specified
 */
function indyCheck(boolCheck) {
    var tabIndyVal = document.getElementById("tabIndyVal");
    for (var i = 1; i < tabIndyVal.rows.length; i++) {
        var chkIndy = tabIndyVal.rows[i].getElementsByTagName("input")[0];
        chkIndy.checked = boolCheck;
    }
}

/**
 * Find the table row with the corresponding indy val
 */
function findIndyTr(val) {
    var strVal = val.replace("<", "&lt;").replace(">", "&gt;");
    var tabIndyVal = document.getElementById("tabIndyVal");
    for (var i = 0; i < tabIndyVal.rows.length; i++) {
        var strValCur = tabIndyVal.rows[i].getElementsByTagName("span")[1].innerHTML;
        if (strVal == strValCur) {
            return tabIndyVal.rows[i];
        }
    }
    return null;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Plot Formatting Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Construct plot formatting controls with the specified label, value and type.
 * The currently supported values of type are "txt" and "bool". The controls are
 * placed at the next available place for their respective type.
 */
function addFmtPlot(label, tag, value, type) {

    var boolTypeTxt = (type == "txt");
    var intFmtIndex = (boolTypeTxt ? _intFmtPlotTxtIndex : _intFmtPlotBoolIndex);
    var intCol = intFmtIndex % _intNumFmtPlotCol;
    var tabFmt = document.getElementById(boolTypeTxt ? "tabFmtPlotTxt" : "tabFmtPlotBool");
    var tdFmt;

    //  if the index is zero, populate the existing cell
    if (0 == intFmtIndex) {
        tdFmt = tabFmt.rows[0].cells[0];
    }

    //  if the table requires a new row, create one
    else if (0 == intCol) {
        var trFmt = tabFmt.insertRow(tabFmt.rows.length);
        for (var i = 0; i < _intNumFmtPlotCol; i++) {
            tdFmt = trFmt.insertCell(i);
            tdFmt.align = "right";
            tdFmt.style.width = _strFmtPlotWidth;
        }
        tdFmt = trFmt.cells[0];
    }

    //  if a new row is not required, get the next available cell on the current row
    else {
        tdFmt = tabFmt.rows[ tabFmt.rows.length - 1 ].cells[intCol];
    }

    //  populate the controls with the specified input information
    if (0 != intFmtIndex) {
        tdFmt.appendChild(document.getElementById(boolTypeTxt ? "spanFmtPlotTxt" : "spanFmtPlotBool").cloneNode(true));
    }

    //  update the label and tag
    setFmtLabelTag(tdFmt, label, tag);

    //  configure and populate the selection control for text settings
    var listFmtTd = tdFmt.getElementsByTagName("td");
    if (boolTypeTxt) {
        var boolSel = (value instanceof Array);
        var selVal = listFmtTd[1].getElementsByTagName("select")[0];
        var txtVal = listFmtTd[1].getElementsByTagName("input")[0];
        selVal.style.display = (boolSel ? "inline" : "none");
        txtVal.style.display = (boolSel ? "none" : "inline");
        if (boolSel) {
            fillSelect(selVal, value);
        }
        else {
            txtVal.value = value;
        }
        _intFmtPlotTxtIndex++;
    }

    //  configure and populate the select control for bool settings
    else {
        tdFmt.getElementsByTagName("select")[0].selectedIndex = ( "true" == value ? 0 : 1 );
        _intFmtPlotBoolIndex++;
    }
}

/**
 * Toggle the visibility of the plot formatting controls
 */
function handleFmtPlotTxtDisp() {
    handleFmtDisp("PlotTxt");
}
function handleFmtSeriesDisp() {
    handleFmtDisp("Series");
}
function handleFmtDisp(type) {
    var spanDisp = document.getElementById("spanFmt" + type + "Disp");
    var tab = document.getElementById("tabFmt" + type);
    var imgArrow = spanDisp.getElementsByTagName("img")[0];
    var spanMsg = spanDisp.getElementsByTagName("span")[0];
    if (null != spanMsg.innerHTML.match("Show.*")) {
        spanMsg.innerHTML = "Hide Formatting Controls";
        imgArrow.src = imgArrow.src.substring(0, imgArrow.src.lastIndexOf("/") + 1) + "arrow_down.gif";
        tab.style.display = "table";
        if ("Series" == type) {
            document.getElementById("btnFmtSeriesDefaults").style.display = "inline";
        }
        else {
            document.getElementById("spanFmtPlotCmd").style.display = "inline";
        }
    } else {
        spanMsg.innerHTML = "Show Formatting Controls";
        imgArrow.src = imgArrow.src.substring(0, imgArrow.src.lastIndexOf("/") + 1) + "arrow_right.gif";
        tab.style.display = "none";
        if ("Series" == type) {
            document.getElementById("btnFmtSeriesDefaults").style.display = "none";
        }
        else {
            document.getElementById("spanFmtPlotCmd").style.display = "none";
        }
    }
}

/**
 * Update the plot formatting default values, depending on the type of plot
 */
function updateFmtPlot() {

    //  determine if vert_plot is true or false
    var tabFmtPlot = document.getElementById("tabFmtPlotBool");
    var selVertPlot = tabFmtPlot.rows[0].cells[2].getElementsByTagName("select")[0];
    var boolVert = (getSelected(selVertPlot)[0] == "true");

    //  determine if the independent variable is a date type
    var selIndyVar = document.getElementById("selIndyVar");
    var strIndyVar = getSelected(selIndyVar)[0];
    var boolIndyDate = !isTmplSpc() &&
            ( strIndyVar == "FCST_VALID_BEG" || strIndyVar == "FCST_INIT_BEG" ||
                    strIndyVar == "FCST_VALID" || strIndyVar == "FCST_INIT"     );

    //  set the default values for each format setting
    var tabFmtPlotTxt = document.getElementById("tabFmtPlotTxt");
    tabFmtPlotTxt.rows[1].cells[1].getElementsByTagName("input")[0].value =
            (boolVert ? "c(6, 4, 4, 4)" : (boolIndyDate ? "c(13, 4, 3, 4)" : "c(8, 4, 5, 4)"));	//  mar
    tabFmtPlotTxt.rows[2].cells[2].getElementsByTagName("input")[0].value =
            (boolVert ? "-.4" : (boolIndyDate ? "-.5" : "-2"           ));	//  title_offset
    setSelected(tabFmtPlotTxt.rows[3].cells[0].getElementsByTagName("select")[0],
            (boolVert ? "1" : (boolIndyDate ? "3" : "1"            )));	//  xtlab_orient
    tabFmtPlotTxt.rows[3].cells[1].getElementsByTagName("input")[0].value =
            (boolVert ? ".5" : (boolIndyDate ? ".5" : "-.75"         ));	//  xtlab_perp
    tabFmtPlotTxt.rows[3].cells[2].getElementsByTagName("input")[0].value =
            (boolVert ? ".6" : (boolIndyDate ? ".9" : ".5"           ));	//  xtlab_horiz
    tabFmtPlotTxt.rows[4].cells[3].getElementsByTagName("input")[0].value =
            (boolVert ? "-2" : (boolIndyDate ? "14" : "2"            ));	//  xlab_offset
    tabFmtPlotTxt.rows[5].cells[2].getElementsByTagName("input")[0].value =
            (boolVert ? "-1" : (boolIndyDate ? ".5" : ".5"           ));	//  ytlab_perp
    tabFmtPlotTxt.rows[6].cells[3].getElementsByTagName("input")[0].value =
            (boolVert ? "2" : (boolIndyDate ? "-2" : "-2"           ));	//  ylab_offset
    tabFmtPlotTxt.rows[9].cells[3].getElementsByTagName("input")[0].value =
            (boolVert ? "1" : (boolIndyDate ? "-.5" : "-.5"          ));	//  x2lab_offset
    tabFmtPlotTxt.rows[12].cells[3].getElementsByTagName("input")[0].value =
            (boolVert ? "c(0, -.17)" : (boolIndyDate ? "c(0, -.48)" : "c(0, -.25)"   ));	//  legend_inset
}

/**
 * Search for the plot formatting control <td> of the specified type with the
 * specified tag.
 */
function getFmtPlotTd(type, tag) {
    var tab = document.getElementById(type == "bool" ? "tabFmtPlotBool" : "tabFmtPlotTxt");
    for (var i = 0; i < tab.rows.length; i++) {
        for (var j = 0; j < tab.rows[i].cells.length; j++) {
            var listTd = tab.rows[i].cells[j].getElementsByTagName("td");
            if (1 > listTd.length) {
                continue;
            }
            if (tag == getFmtTag(tab.rows[i].cells[j])) {
                return tab.rows[i].cells[j];
            }
        }
    }
    return null;
}


/**
 * Build the list of plot series reflected by the current state of the controls
 */
function buildSeriesDiv() {

    var strSeriesNameArray = new Array();
    group_name_to_value_map = new Object();

    if (isTmplSpc()) {
        return;
    }

    var tabFmtSeries = document.getElementById("tabFmtSeries");
    var spanFmtSeriesDisp = document.getElementById("spanFmtSeriesDisp");
    _intNumSeries = 0;

    //  determine if the plot is an ensemble spread/skill
    var boolEnsSS = ( _intTmpl == TMPL_ENS_SS );
    var boolEnsSSPtsDisp = ( "TRUE" == getFmtVal(getFmtPlotTd("txt", "ensss_pts_disp")) );

    //  update the visibility of the series formatting controls
    spanFmtSeriesDisp.style.display = "inline";
    var spanMsg = spanFmtSeriesDisp.getElementsByTagName("span")[0];
    if (null != spanMsg.innerHTML.match("Hide.*")) {
        document.getElementById("tabFmtSeries").style.display = "inline";
    }
    document.getElementById("tabFmtSeriesRhist").style.display = "none";

    //  build a table containing all current series settings
    var listFmt = new Array();
    var tableFmt = new Hashtable();
    for (var intRow = 0; intRow < tabFmtSeries.rows.length; intRow += 2) {
        var listSpan = tabFmtSeries.rows[intRow].getElementsByTagName("span");
        var listInput = tabFmtSeries.rows[intRow].getElementsByTagName("input");
        var listFmtTd = getFmtSeriesVal(intRow);

        //  get the series name and values and put them in the table
        var strSeriesName = listSpan[2].innerHTML + " - " + listSpan[3].innerHTML;
        var strFmt = listInput[0].value;
        strFmt += "|" + listInput[1].checked;
        for (var j = 0; j < listFmtTd.length; j++) {
            strFmt += "|" + getFmtVal(listFmtTd[j]);
        }
        listFmt.push(strFmt);
        if (listInput[0].value != "false") {
            tableFmt.put(strSeriesName, strFmt);
        }
    }

    //  determine if the lockbox is checked
    var boolLockFmt = document.getElementById("chkFmtSeriesLock").checked;

    //  clear all existing series, except the first two
    while (2 < tabFmtSeries.rows.length) {
        tabFmtSeries.deleteRow(tabFmtSeries.rows.length - 1);
    }

    //  build permutation of the series values
    var tabField = new Hashtable();
        for(var i=0; i< _listSeries1Div.length; i++){
            var listVal = getSelected(_listSeries1Div[i].getElementsByTagName("select")[1]);
            var strVar = getSelected(_listSeries1Div[i].getElementsByTagName("select")[0])[0];
            var isGroup= _listSeries1Div[i].getElementsByTagName("input")[1].checked;
            var seriesName = "";
            if(isGroup){
                seriesName = _listSeries1Div[i].getElementsByTagName("label")[0].innerHTML;
                group_name_to_value_map[seriesName] = listVal;
                listVal = [seriesName];
            }

            var strValCur = tabField.get(strVar);
            if(undefined != strValCur){
                listVal = strValCur.concat(listVal);
            }
            tabField.put(strVar, listVal);
        }
    var listSeries1Perm = permuteSeriesNew(tabField, 0);
    var tabField = new Hashtable();
    for (var i = 0; i < _listSeries2Div.length; i++) {
        var listVal = getSelected(_listSeries2Div[i].getElementsByTagName("select")[1]);
        var strVar = getSelected(_listSeries2Div[i].getElementsByTagName("select")[0])[0];
        var isGroup = _listSeries2Div[i].getElementsByTagName("input")[1].checked;
        var seriesName = "";
        if (isGroup) {
            seriesName = _listSeries2Div[i].getElementsByTagName("label")[0].innerHTML;
            group_name_to_value_map[seriesName] = listVal;
            listVal = [seriesName];
        }
        var strValCur = tabField.get(strVar);
        if (undefined != strValCur) {
            listVal = strValCur.concat(listVal);
        }
        tabField.put(strVar, listVal);
    }
    var listSeries2Perm = permuteSeriesNew(tabField, 0);

    //  build all y1 and y2 series
    for (var intY = 1; intY <= 2; intY++) {

        //  set the dep controls
        var listDepDiv = (1 == intY || boolEnsSS ? _listDep1Div : _listDep2Div);
        var listSeriesPerm = (1 == intY || boolEnsSS ? listSeries1Perm : listSeries2Perm);
        var intNumDep = !boolEnsSS ? listDepDiv.length : 1;

        //  for each dep div, consider the fcst_var and selected stats
        for (var intDep = 0; intDep < intNumDep; intDep++) {

            //  get the dep var information
            var strFcstVar = getSelected(listDepDiv[intDep].getElementsByTagName("select")[0])[0];
            var listStat = getSelected(listDepDiv[intDep].getElementsByTagName("select")[1]);
            var intNumStat = !boolEnsSS ? listStat.length : 1;

            //  build a series for each combination of fcst_var, stat and series permutation

            for (var intStat = 0; intStat < intNumStat; intStat++) {
                for (var intSeries = 0; intSeries < listSeriesPerm.length; intSeries++) {

                    //  build the series name
                    var strStatName = !boolEnsSS ? listStat[intStat] : (1 == intY ? "MSE" : "#PTS");

                    if (_strPlotData == "mode" && -1 == listSearch(strStatName, _listStatModelRatio)) {
                        //  determine the first letter of the code [A|F|O|D]
                        var boolDiff = listDepDiv[intDep].getElementsByTagName("input")[3].checked;
                        var boolFcst = listDepDiv[intDep].getElementsByTagName("input")[4].checked;
                        var boolObs = listDepDiv[intDep].getElementsByTagName("input")[5].checked;
                        var strCode = "_";
                        if (-1 < listSearch(strStatName, _listStatModeSingle)) {
                            if (boolDiff) {
                                strCode += "D";
                            }
                            else if (boolFcst && boolObs) {
                                strCode += "A";
                            }
                            else if (boolFcst) {
                                strCode += "F";
                            }
                            else if (boolObs) {
                                strCode += "O";
                            }
                            else {
                                strCode += "A";
                            }
                        }
                        //  if the stat is ACOV, return the code
                        if (null != strStatName.match(/^ACOV$/)) {
                            strCode = strStatName + strCode + "SA";
                        }

                        //  determine the second letter of the code [A|S|C]
                        var boolSimp = listDepDiv[intDep].getElementsByTagName("input")[6].checked;
                        var boolClus = listDepDiv[intDep].getElementsByTagName("input")[7].checked;
                        if (boolSimp && boolClus) {
                            strCode += "A";
                        }
                        else if (boolSimp) {
                            strCode += "S";
                        }
                        else if (boolClus) {
                            strCode += "C";
                        }
                        else {
                            strCode += "A";
                        }

                        //  determine the third letter of the code [A|M|U]
                        var boolMat = listDepDiv[intDep].getElementsByTagName("input")[8].checked;
                        var boolUnm = listDepDiv[intDep].getElementsByTagName("input")[9].checked;
                        if (boolMat && boolUnm) {
                            strCode += "A";
                        }
                        else if (boolMat) {
                            strCode += "M";
                        }
                        else if (boolUnm) {
                            strCode += "U";
                        }
                        else {
                            strCode += "A";
                        }
                        strStatName = strStatName + strCode

                    }
                    var strSeriesName = listSeriesPerm[intSeries] + (!boolEnsSS ? " " + strFcstVar : "") + " " + strStatName;
                    strSeriesNameArray.push(strSeriesName);

                    var trFmtSeries;
                    var tdName;

                    //  if the series is the first to be built, use the existing controls
                    if (0 == _intNumSeries) {
                        trFmtSeries = tabFmtSeries.rows[0];
                        tdName = trFmtSeries.cells[0];
                    }

                    //  otherwise, build a new set of series formatting controls
                    else {

                        //  insert the <hr/> between series format controls
                        if (1 == _intNumSeries) {
                            tabFmtSeries.rows[1].style.display = "table-row";
                        }
                        else {
                            var trHR = tabFmtSeries.insertRow(tabFmtSeries.rows.length);
                            var tdHR = trHR.insertCell(0);
                            tdHR.colSpan = "3";
                            tdHR.appendChild(document.getElementById("spanFmtSeriesHR").cloneNode(true));
                        }

                        //  insert a copy of the series format controls
                        trFmtSeries = tabFmtSeries.insertRow(tabFmtSeries.rows.length);

                        var tdName = trFmtSeries.insertCell(0);
                        tdName.align = "right";
                        tdName.style.width = "350px";
                        tdName.style.paddingTop = "20px";
                        tdName.appendChild(document.getElementById("spanFmtSeriesName").cloneNode(true));

                        var tdFmt1 = trFmtSeries.insertCell(1);
                        tdFmt1.align = "right";
                        tdFmt1.style.width = "200px";
                        tdFmt1.style.paddingTop = "20px";
                        tdFmt1.appendChild(document.getElementById("tabFmtSeriesVal1").cloneNode(true));
                        tdFmt1.getElementsByTagName("input")[1].value = "";

                        var tdFmt2 = trFmtSeries.insertCell(2);
                        tdFmt2.align = "right";
                        tdFmt2.style.width = "275px";
                        tdFmt2.style.paddingTop = "20px";
                        tdFmt2.appendChild(document.getElementById("tabFmtSeriesVal2").cloneNode(true));
                    }

                    //  populate the controls with the series name
                    var strYSeries = (1 == intY ? "Y1" : "Y2") + " Series";
                    var strSeriesNameArr = strSeriesName.split(" ");
                    var strSeriesNameNoGroup="";
                    for(k=0; k< strSeriesNameArr.length; k++){
                        if (group_name_to_value_map[strSeriesNameArr[k]] != null) {
                            strSeriesNameNoGroup = strSeriesNameNoGroup  + group_name_to_value_map[strSeriesNameArr[k]].join() + " ";
                        }else{
                            strSeriesNameNoGroup = strSeriesNameNoGroup + strSeriesNameArr[k]  + " ";
                        }
                    }
                    tdName.getElementsByTagName("span")[2].setAttribute("title", strSeriesNameNoGroup);
                    tdName.getElementsByTagName("span")[2].innerHTML = strSeriesName;

                    tdName.getElementsByTagName("span")[3].innerHTML = strYSeries;

                    //  add change handlers to the formatting inputs
                    var listInput = trFmtSeries.getElementsByTagName("input");
                    listInput[1].setAttribute("onclick", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
                    if (_boolIE) {
                        listInput[1].attachEvent("onclick", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
                    }

                    listInput[2].setAttribute("onclick", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
                    if (_boolIE) {
                        listInput[2].attachEvent("onclick", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
                    }
                    listInput[2].value = _intNumSeries + 1;
                    for (var i = 3; i < listInput.length; i++) {
                        listInput[i].setAttribute("onkeydown", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
                        if (_boolIE) {
                            listInput[i].attachEvent("onkeydown", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
                        }
                    }
                    var listSel = trFmtSeries.getElementsByTagName("select");
                    for (var i = 0; i < listSel.length; i++) {
                        listSel[i].setAttribute("onchange", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
                        if (_boolIE) {
                            listSel[i].attachEvent("onchange", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
                        }
                    }

                    //  get format settings for the current field, if available, otherwise use defaults
                    var listVal = _listFmtSeriesDefaults;
                    var strVal = tableFmt.get(escapeXml(strSeriesName) + " - " + strYSeries);
                    if (boolLockFmt) {
                        listVal = listFmt[ _intNumSeries % listFmt.length ].split("|");
                    }
                    else if (undefined != strVal) {
                        listVal = strVal.split("|");
                    }

                    //  apply the settings to the formatting controls
                    listInput[0].value = listVal[0];
                    tdName.getElementsByTagName("input")[1].checked = (listVal[1] == "true" ? true : false);
                    var listFmtTd = getFmtSeriesVal(_intNumSeries * 2);
                    for (var i = 0; i < listFmtTd.length; i++) {
                        setFmtVal(listFmtTd[i], listVal[i + 2]);
                    }

                    _intNumSeries++;

                }  //  end: for(var intSeries=0; intSeries < listSeriesPerm.length; intSeries++)

            }  //  end: for(var intStat=0; intStat < listStat.length; intStat++)

        }  //  end: for(var intDep=0; intDep < listDepDiv.length; intDep++)

    }  //  end: for(var intY=1; intY <= 2; intY++)
    //check if some series were deleted and remove them from diff series
    var seriesDiff = new Array();
    for (var i = 0; i < seriesDiffY1.length; i++) {
        var diffSeries1 = seriesDiffY1[i].split("--")[0].replace("&lt;","<" ).replace("&gt;",">");
        var diffSeries2 = seriesDiffY1[i].split("--")[1].replace("&lt;","<").replace("&gt;",">");
        var isDiffSeries1 = false, isDiffSeries2 = false;
        for (var j = 0; j < strSeriesNameArray.length; j++) {
            if (diffSeries1 == strSeriesNameArray[j]) {
                isDiffSeries1 = true;
            }
            if (diffSeries2 == strSeriesNameArray[j]) {
                isDiffSeries2 = true;
            }
        }
        if (isDiffSeries1 && isDiffSeries2) {
            seriesDiff.push(seriesDiffY1[i]);
        }
    }
    seriesDiffY1 = seriesDiff;
    seriesDiff = new Array();
    for (var i = 0; i < seriesDiffY2.length; i++) {
        var diffSeries1 = seriesDiffY2[i].split("--")[0].replace("&lt;","<" ).replace("&gt;",">");
        var diffSeries2 = seriesDiffY2[i].split("--")[1].replace("&lt;","<" ).replace("&gt;",">");
        var isDiffSeries1 = false, isDiffSeries2 = false;
        for (var j = 0; j < strSeriesNameArray.length; j++) {
            if (diffSeries1 == strSeriesNameArray[j]) {
                isDiffSeries1 = true;
            }
            if (diffSeries2 == strSeriesNameArray[j]) {
                isDiffSeries2 = true;
            }
        }
        if (isDiffSeries1 && isDiffSeries2) {
            seriesDiff.push(seriesDiffY2[i]);
        }
    }
    seriesDiffY2 = seriesDiff;
    createDiffSeries(seriesDiffY1, 1, tabFmtSeries, tableFmt, boolLockFmt, listFmt);
    createDiffSeries(seriesDiffY2, 2, tabFmtSeries, tableFmt, boolLockFmt, listFmt);

    //  set the default color for each series to the appropriate shade of rainbow
    var listColors = rainbow(_intNumSeries);
    for (var i = 0; i < _intNumSeries; i++) {
        var listFmtTd = getFmtSeriesVal(i * 2);
        var strColor = getFmtVal(listFmtTd[1]);
        if ("" == strColor) {
            setFmtVal(listFmtTd[1], listColors[i]);
        }
    }

    //  show or hide the controls, depending on the number of series
    tabFmtSeries.style.display = (1 > _intNumSeries ? "none" : tabFmtSeries.style.display);
    spanFmtSeriesDisp.style.display = (1 > _intNumSeries ? "none" : "inline");
    document.getElementById("spanFmtSeriesNum").innerHTML = "# Series: " + _intNumSeries;
    if (_intNumSeries >= 1 && (_intTmpl == TMPL_SERIES_PLOT || _intTmpl == TMPL_BAR_PLOT || _intTmpl == TMPL_BOX_PLOT)) {
        document.getElementById("btnFmtAddDifferenceCurve").style.display = "inline";
    } else {
        document.getElementById("btnFmtAddDifferenceCurve").style.display = "none";
    }

}

function createDiffSeries(seriesDiffY, ySeries, tabFmtSeries, tableFmt, boolLockFmt, listFmt) {

    for (var intseriesDiffY1 = 0; intseriesDiffY1 < seriesDiffY.length; intseriesDiffY1++) {
        var diffSeries1 = seriesDiffY[intseriesDiffY1].split("--")[0];
        var diffSeries2 = seriesDiffY[intseriesDiffY1].split("--")[1];

        //  build the series name
        var strSeriesName = "DIFF (" + diffSeries1 + "-" + diffSeries2 + ")";

        //  build the series title
        var strSeriesNameArr = diffSeries1.split(" ");
        var diffSeries1Title = "";
        for (k = 0; k < strSeriesNameArr.length; k++) {
            if (group_name_to_value_map[strSeriesNameArr[k]] != null) {
                diffSeries1Title = diffSeries1Title + group_name_to_value_map[strSeriesNameArr[k]].join() + " ";
            } else {
                diffSeries1Title = diffSeries1Title + strSeriesNameArr[k] + " ";
            }
        }
        strSeriesNameArr = diffSeries2.split(" ");
        var diffSeries2Title = "";
        for (k = 0; k < strSeriesNameArr.length; k++) {
            if (group_name_to_value_map[strSeriesNameArr[k]] != null) {
                diffSeries2Title = diffSeries2Title + group_name_to_value_map[strSeriesNameArr[k]].join() + " ";
            } else {
                diffSeries2Title = diffSeries2Title + strSeriesNameArr[k] + " ";
            }
        }
        var strSeriesTitle = "DIFF (" + diffSeries1Title + "-" + diffSeries2Title + ")";

        var trFmtSeries;
        var tdName;
        //  insert the <hr/> between series format controls
        if (1 == _intNumSeries) {
            tabFmtSeries.rows[1].style.display = "table-row";
        }
        else {
            var trHR = tabFmtSeries.insertRow(tabFmtSeries.rows.length);
            var tdHR = trHR.insertCell(0);
            tdHR.colSpan = "3";
            tdHR.appendChild(document.getElementById("spanFmtSeriesHR").cloneNode(true));
        }

        //  insert a copy of the series format controls
        trFmtSeries = tabFmtSeries.insertRow(tabFmtSeries.rows.length);

        var tdName = trFmtSeries.insertCell(0);
        tdName.align = "right";
        tdName.style.width = "350px";
        tdName.style.paddingTop = "20px";
        tdName.appendChild(document.getElementById("spanFmtSeriesName").cloneNode(true));

        var tdFmt1 = trFmtSeries.insertCell(1);
        tdFmt1.align = "right";
        tdFmt1.style.width = "200px";
        tdFmt1.style.paddingTop = "20px";
        tdFmt1.appendChild(document.getElementById("tabFmtSeriesVal1").cloneNode(true));
        tdFmt1.getElementsByTagName("input")[1].value = "";

        var tdFmt2 = trFmtSeries.insertCell(2);
        tdFmt2.align = "right";
        tdFmt2.style.width = "275px";
        tdFmt2.style.paddingTop = "20px";
        tdFmt2.appendChild(document.getElementById("tabFmtSeriesVal2").cloneNode(true));


        //  populate the controls with the series name
        var strYSeries = "Y" + ySeries + " Series";
        tdName.getElementsByTagName("span")[1].innerHTML = "<button onclick='deleteDiffSeries(this, \"" + seriesDiffY[intseriesDiffY1] + "\", " + ySeries + ");'>Delete</button>";
        tdName.getElementsByTagName("span")[2].innerHTML = strSeriesName;
        tdName.getElementsByTagName("span")[2].setAttribute("title", strSeriesTitle);
        tdName.getElementsByTagName("span")[3].innerHTML = strYSeries;

        //  add change handlers to the formatting inputs
        var listInput = trFmtSeries.getElementsByTagName("input");
        listInput[1].setAttribute("onclick", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
        if (_boolIE) {
            listInput[1].attachEvent("onclick", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
        }

        listInput[2].setAttribute("onclick", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
        if (_boolIE) {
            listInput[2].attachEvent("onclick", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
        }
        listInput[2].value = _intNumSeries + 1;
        for (var i = 3; i < listInput.length; i++) {
            listInput[i].setAttribute("onkeydown", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
            if (_boolIE) {
                listInput[i].attachEvent("onkeydown", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
            }
        }
        var listSel = trFmtSeries.getElementsByTagName("select");
        for (var i = 0; i < listSel.length; i++) {
            listSel[i].setAttribute("onchange", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
            if (_boolIE) {
                listSel[i].attachEvent("onchange", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
            }
        }

        //  get format settings for the current field, if available, otherwise use defaults
        var listVal = _listFmtSeriesDefaults;
        var strVal = tableFmt.get(escapeXml(strSeriesName) + " - " + strYSeries);
        if (boolLockFmt) {
            listVal = listFmt[ _intNumSeries % listFmt.length ].split("|");
        }
        else if (undefined != strVal) {
            listVal = strVal.split("|");
        }

        //  apply the settings to the formatting controls
        listInput[0].value = listVal[0];
        tdName.getElementsByTagName("input")[1].checked = (listVal[1] == "true" ? true : false);
        var listFmtTd = getFmtSeriesVal(_intNumSeries * 2);
        for (var i = 0; i < listFmtTd.length; i++) {
            setFmtVal(listFmtTd[i], listVal[i + 2]);
        }

        _intNumSeries++;
    }

}

/**
 * Build and return a list of the format control td structures in the specified
 * row
 */
function getFmtSeriesVal(row) {

    //  determine the id of the series formatting controls table
    var strTabFmtSeriesId = "tabFmtSeries";
    switch (_intTmpl) {
        case TMPL_RHIST:
            strTabFmtSeriesId = "tabFmtSeriesRhist";
            break;
        case TMPL_ROC  :
            strTabFmtSeriesId = "tabFmtSeriesRoc";
            break;
        case TMPL_RELY :
            strTabFmtSeriesId = "tabFmtSeriesRely";
            break;
    }

    //  get and validate the requested row
    var listTdFmt = new Array();
    var tabFmtSeries = document.getElementById(strTabFmtSeriesId);

    var trFmtSeries = tabFmtSeries.rows[row];

    if (!trFmtSeries || 2 > trFmtSeries.cells.length) {
        return listTdFmt;
    }

    //  build a list of formatting td elements
    var tabVal1 = trFmtSeries.cells[1].getElementsByTagName("table")[0];
    for (var i = 0; i < tabVal1.rows.length; i++) {
        for (var j = 0; j < tabVal1.rows[i].cells.length; j++) {
            listTdFmt.push(tabVal1.rows[i].cells[j]);
        }
    }
    if (TMPL_RHIST != _intTmpl) {
        var tabVal2 = trFmtSeries.cells[2].getElementsByTagName("table")[0];
        for (var i = 0; i < tabVal2.rows.length; i++) {
            for (var j = 0; j < tabVal2.rows[i].cells.length; j++) {
                listTdFmt.push(tabVal2.rows[i].cells[j]);
            }
        }
    }

    return listTdFmt;
}

/**
 * Validate that the specified row in the series formatting controls contains a
 * Hide checkbox. If so, return the checkbox control, otherwise, null.
 */
function getFmtSeriesHideChk(row) {
    var tabFmtSeries = document.getElementById("tabFmtSeries");
    var trFmtSeries = tabFmtSeries.rows[row];
    if (3 != trFmtSeries.cells.length) {
        return null;
    }
    return trFmtSeries.cells[0].getElementsByTagName("input")[1];
}

/**
 * Determine the state of the Hide checkbox for the input row and return the
 * state of the control
 */
function getFmtSeriesHide(row) {
    return getFmtSeriesHideChk(row).checked;
}

/**
 * Set the state of the Hide checkbox for the input row to the specified value
 */
function setFmtSeriesHide(row, val) {
    getFmtSeriesHideChk(row).checked = val;
}

/**
 * Sets the value of the specified series modification indicator control to the
 * specified value, defaulting to true (modified).
 */
function setFmtSeriesMod(series, val) {
    var tabFmtSeries = document.getElementById("tabFmtSeries");
    var txtMod = tabFmtSeries.rows[series * 2].getElementsByTagName("input")[0];
    txtMod.value = (undefined != val ? val : "true");
}

/**
 * Reset all series controls to their default values and set all series
 * modification indicator controls to false (unmodified).
 */
function setFmtSeriesDefaults() {
    var tabFmtSeries = document.getElementById("tabFmtSeries");
    for (var i = 0; i < _intNumSeries; i++) {
        setFmtSeriesMod(i, "false");
    }
    buildSeriesDiv();
}

/**
 * Build a list of all series variable combinations for the specified list of
 * series field divs, starting with the div at the specified index (0 for all
 * permutations). If a difference curve is specified, add it to the series.
 */
function permuteSeries(listSeriesDiv, intIndex, boolDiff) {

    var tabField = new Hashtable();
    for(var i=0; i< listSeriesDiv.length; i++){
        var listVal = getSelected(listSeriesDiv[i].getElementsByTagName("select")[1]);
        var strVar = getSelected(listSeriesDiv[i].getElementsByTagName("select")[0])[0];
        var isGroup= listSeriesDiv[i].getElementsByTagName("input")[1].checked;
        if(isGroup){
            listVal = [listVal.join()];
        }
        var strValCur = tabField.get(strVar);
        if(undefined != strValCur){
            listVal = strValCur.concat(listVal);
        }
        tabField.put(strVar, listVal);
    }

    if (1 > listSeriesDiv.length) {
        return [];
    }
    var listVal = getSelected(listSeriesDiv[intIndex].getElementsByTagName("select")[1]);
    var isGroup= listSeriesDiv[intIndex].getElementsByTagName("input")[1].checked;

    //  if the index has reached the end of the list, return the selected values
    //  from the last control
    if (listSeriesDiv.length == intIndex + 1) {
        if(isGroup){
            listVal = [listVal.join()];
        }
        return listVal;
    }

    //  otherwise, get the list for the next fcst_var and build upon it
    var listValNext = permuteSeries(listSeriesDiv, intIndex + 1, boolDiff);
    if (1 > listVal.length) {
        return listValNext;
    }
    if(isGroup){
        listVal = [listVal.join()];
    }
    var listRet = [];
    for (var i = 0; i < listVal.length; i++) {
        for (var j = 0; j < listValNext.length; j++) {
            listRet.push(listVal[i] + " " + listValNext[j]);
        }
    }
    return listRet;
}

/**
 * Build a list of all series variable combinations for the specified list of
 * series field divs, starting with the div at the specified index (0 for all
 * permutations). If a difference curve is specified, add it to the series.
 */
function permuteSeriesNew(tabField, intIndex) {

    var keys = tabField.listKeys();
    if (1 > keys.length) {
        return [];
    }
    var strVar = keys[intIndex];
    var listVal = tabField.get(strVar);

    //  if the index has reached the end of the list, return the selected values
    //  from the last control
    if (keys.length == intIndex + 1) {

        return listVal;
    }

    //  otherwise, get the list for the next fcst_var and build upon it
    var listValNext = permuteSeriesNew(tabField, intIndex + 1);
    if (1 > listVal.length) {
        return listValNext;
    }

    var listRet = [];
    for (var j = 0; j < listValNext.length; j++) {
        for (var i = 0; i < listVal.length; i++) {
            listRet.push(listVal[i] + " " + listValNext[j]);
        }
    }
    return listRet;
}

/**
 * Build a list of all series fields and variable combinations for the specified list of
 * series field divs, starting with the div at the specified index (0 for all
 * permutations). If a difference curve is specified, add it to the series.
 */
function permuteSeriesWithField(listSeriesDiv, intIndex) {

    if (1 > listSeriesDiv.length) {
        return new Array();
    }
    var listVal = getSelected(listSeriesDiv[intIndex].getElementsByTagName("select")[1]);
    var listFields = getSelected(listSeriesDiv[intIndex].getElementsByTagName("select")[0]);
    var listFieldsVal = new Array();
    var index = 0;
    for (var i = 0; i < listFields.length; i++) {
        for (var j = 0; j < listVal.length; i++) {
            listFieldsVal[index] = listFields[i] + " " + listVal[j];
            index++;
        }
    }

    //  otherwise, get the list for the next fcst_var and build upon it
    var listFieldsValNext = permuteSeriesWithField(listSeriesDiv, intIndex + 1);
    if (1 > listFieldsVal.length) {
        return listFieldsValNext;
    }
    var listRet = new Array();

    for (var j = 0; j < listFieldsValNext.length; j++) {
        for (var i = 0; i < listFieldsVal.length; i++) {
            listRet.push(listFieldsVal[i] + " " + listFieldsValNext[j]);
        }
    }
    return listRet;
}

/**
 * Return the boolean value of the format setting for plotN_diff, where N is
 * specified as either 1 or 2
 */
function getPlotDiff(y) {
    var tab = document.getElementById("tabFmtPlotBool");
    for (var i = 0; i < tab.rows.length; i++) {
        for (var j = 0; j < tab.rows[i].cells.length; j++) {
            var listTd = tab.rows[i].cells[j].getElementsByTagName("td");
            if (1 > listTd.length) {
                continue;
            }
            if ("plot" + y + "_diff" == getFmtTag(tab.rows[i].cells[j])) {
                return ( "true" == getFmtVal(tab.rows[i].cells[j]) );
            }
        }
    }
    return false;
}

/**
 * Set up the format series controls for the rhist template
 */
function buildSeriesDivSpc() {

    //  hide all the series formatting controls
    document.getElementById("tabFmtSeries").style.display = "none";
    document.getElementById("spanFmtSeriesDisp").style.display = "none";
    document.getElementById("tabFmtSeriesRhist").style.display = "none";
    document.getElementById("tabFmtSeriesRoc").style.display = "none";
    document.getElementById("tabFmtSeriesRely").style.display = "none";

    //  determine the formatting controls to configure
    var strFmtSeriesTab = "tabFmtSeriesRhist";
    if (TMPL_RHIST == _intTmpl) {
        strFmtSeriesTab = "tabFmtSeriesRhist";
    }
    else if (TMPL_ROC == _intTmpl) {
        strFmtSeriesTab = "tabFmtSeriesRoc";
    }
    else if (TMPL_RELY == _intTmpl) {
        strFmtSeriesTab = "tabFmtSeriesRely";
    }
    var tabFmtSeries = document.getElementById(strFmtSeriesTab);
    tabFmtSeries.style.display = "inline";

    //  clear all existing series, except the first two
    if (!isTmplSpc()) {
        while (2 < tabFmtSeries.rows.length) {
            tabFmtSeries.deleteRow(tabFmtSeries.rows.length - 1);
        }
    }

    //  show or hide the controls, depending on the number of series
    _intNumSeries = ( _intTmpl == TMPL_RELY ? 2 : 1);
    tabFmtSeries.style.display = tabFmtSeries.style.display;
    document.getElementById("spanFmtSeriesNum").innerHTML = "# Series: " + _intNumSeries;

}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Agg Stat Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Update the agg_stat controls according to the enabled checkbox setting
 */
function updateAggStat() {
    var divAggStat = document.getElementById("divAggStat");
    var chkAggStat = divAggStat.getElementsByTagName("input")[0];
    document.getElementById("tabAggStatParm").style.display = (chkAggStat.checked ? "table" : "none");
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Calc Stat Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Update the calc_stat controls according to the enabled checkbox setting
 */
function updateCalcStat() {
    var divCalcStat = document.getElementById("divCalcStat");
    var chkCalcStat = divCalcStat.getElementsByTagName("input")[0];
    document.getElementById("tabCalcStatParm").style.display = (chkCalcStat.checked ? "table" : "none");
    if (_strInitXML && _strInitXML.length > 0) {
        var plot_stat = _strInitXML.match(/<plot_stat>(\w+)<\/plot_stat>/)[1];
        document.getElementById("plot_stat").value = plot_stat;
    }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Plot Spec Functions
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Contruct the plot spec xml from information selected in the plot controls
 */
function buildPlotXML() {

    var listInput;

    var strDepXML = "";
    var strTemplate = getSelected(document.getElementById("selTemplate"))[0];

    //  <template>
    strDepXML += "<template>" + strTemplate + ".R_tmpl</template>";

    if (isTmplSpc()) {

        //  <plot_fix>
        strDepXML += "<plot_fix>" + buildFieldValXML("field", "val", _listFixSpcDiv, false, true) + "</plot_fix>";

        //  <roc_calc>
        if (TMPL_ROC == _intTmpl) {
            var listRocCalcParm = document.getElementById("tabRocCalcParm").getElementsByTagName("input");
            strDepXML += "<roc_calc>";
            strDepXML += "<roc_pct>" + listRocCalcParm[0].checked + "</roc_pct>";
            strDepXML += "<roc_ctc>" + listRocCalcParm[1].checked + "</roc_ctc>";
            strDepXML += "</roc_calc>";
        }
        if (TMPL_RHIST == _intTmpl) {
            var isNormalized_histogram = $('input[name=normalized_histogram]:checked').val();
            strDepXML += "<normalized_histogram>" + isNormalized_histogram + "</normalized_histogram>";
        }

    } else {

        //  <dep>
        if (TMPL_ENS_SS != _intTmpl) {
            strDepXML += "<dep>";
            strDepXML += "<dep1>" + buildFieldValXML("fcst_var", "stat", _listDep1Div, true, false) + "</dep1>";
            strDepXML += "<dep2>" + buildFieldValXML("fcst_var", "stat", _listDep2Div, true, false) + "</dep2>";
            //  strDepXML += "<fix></fix></dep>";
            strDepXML += "</dep>";
        }

        //  <series1> and <series2>
        var strSeriesXML = "";
        strDepXML += "<series1>" + buildFieldValXMLSeries("field", "val", _listSeries1Div, false, false) + "</series1>";
        strDepXML += "<series2>" + buildFieldValXMLSeries("field", "val", _listSeries2Div, false, false) + "</series2>";

        //  <plot_fix>
        if (TMPL_ENS_SS != _intTmpl) {
            strDepXML += "<plot_fix>" + buildFieldValXML("field", "val", _listFixDiv, false, true) + "</plot_fix>";
        } else {
            strDepXML += "<plot_fix>" + buildFieldValXML("field", "val", _listFixSpcDiv, false, true) + "</plot_fix>";

        }

        //  <plot_cond>
        var strPlotCond = isTmplSpc() ?
                document.getElementById("txtPlotCondSpc").value :
                document.getElementById("txtPlotCond").value;
        strDepXML += "<plot_cond>" + strPlotCond + "</plot_cond>";

        //  <indep>
        var divIndy = document.getElementById("divIndy");
        var tabIndyVal = document.getElementById("tabIndyVal");
        var strIndepField = getSelected(divIndy.getElementsByTagName("select")[0])[0].toLowerCase();
        strDepXML += "<indep name=\"" + strIndepField + "\">";
        for (var i = 1; i < tabIndyVal.rows.length; i++) {
            listInput = tabIndyVal.rows[i].getElementsByTagName("input");
            var boolIndyValChk = listInput[0].checked;
            var strVal = tabIndyVal.rows[i].getElementsByTagName("span")[1].innerHTML;
            var strLab = listInput[1].value;
            var strPlotVal = listInput[2].value;
            if (boolIndyValChk) {
                strDepXML += "<val label=\"" + strLab + "\" plot_val=\"" + strPlotVal + "\">" + strVal + "</val>";
            }
        }
        strDepXML += "</indep>";

        //  agg_stat
        var chkAggStat = document.getElementById("chkAggStat");
        if (chkAggStat.checked) {
            var listAggStatParm = document.getElementById("tabAggStatParm").getElementsByTagName("input");
            var listEveqDis = document.getElementById("tabAggStatParm").getElementsByTagName("select");
            var listCacheAggStat = document.getElementById("cacheAggStat");
            strDepXML += "<agg_stat>";
            strDepXML += "<agg_ctc>" + listAggStatParm[0].checked + "</agg_ctc>";
            strDepXML += "<agg_sl1l2>" + listAggStatParm[1].checked + "</agg_sl1l2>";
            strDepXML += "<agg_pct>" + listAggStatParm[2].checked + "</agg_pct>";
            strDepXML += "<agg_nbrcnt>" + listAggStatParm[3].checked + "</agg_nbrcnt>";
            strDepXML += "<boot_repl>" + listAggStatParm[4].value + "</boot_repl>";
            strDepXML += "<boot_ci>" + listAggStatParm[5].value + "</boot_ci>";
            strDepXML += "<eveq_dis>" + listEveqDis[0].options[ listEveqDis[0].selectedIndex ].text + "</eveq_dis>";
            strDepXML += "<cache_agg_stat>" + listCacheAggStat.options[ listCacheAggStat.selectedIndex ].text + "</cache_agg_stat>";
            strDepXML += "</agg_stat>";
        }

        //Plot statistic
        var plot_stat = document.getElementById("plot_stat");
        var plot_stat_value = plot_stat.options[plot_stat.selectedIndex].value;
        strDepXML += "<plot_stat>" + plot_stat_value + "</plot_stat>";

        //  calc_stat
        var chkCalcStat = document.getElementById("chkCalcStat");
        if (chkCalcStat.checked) {
            var listCalcStatParm = document.getElementById("tabCalcStatParm").getElementsByTagName("input");
            strDepXML += "<calc_stat>";
            strDepXML += "<calc_ctc>" + listCalcStatParm[0].checked + "</calc_ctc>";
            strDepXML += "<calc_sl1l2>" + listCalcStatParm[1].checked + "</calc_sl1l2>";
            strDepXML += "</calc_stat>";
        }

    }
    var seriesDiffY1List = new Array();
    if (seriesDiffY1.length > 0) {
        for (var i = 0; i < seriesDiffY1.length; i++) {
            var name1Arr = seriesDiffY1[i].split("--")[0].split(" ");
            var name1 = "";
            for (var k = 0; k < name1Arr.length; k++) {
                if (group_name_to_value_map[name1Arr[k]] != null) {
                    name1 = name1 + group_name_to_value_map[name1Arr[k]].join() + " ";
                } else {
                    name1 = name1 + name1Arr[k] + " ";
                }
            }
            name1 = name1.substring(0, name1.length-1);
            var name2Arr = seriesDiffY1[i].split("--")[1].split(" ");
            var name2 = "";
            for (var k = 0; k < name2Arr.length; k++) {
                if (group_name_to_value_map[name2Arr[k]] != null) {
                    name2 = name2 + group_name_to_value_map[name2Arr[k]].join() + " ";
                } else {
                    name2 = name2 + name2Arr[k] + " ";
                }
            }
            name2 = name2.substring(0, name2.length-1);
            seriesDiffY1List.push('c("' + name1 + '","' + name2 + '")');
        }
    }
    var seriesDiffY2List = new Array();
    if (seriesDiffY2.length > 0) {
        for (var i = 0; i < seriesDiffY2.length; i++) {
            var name1Arr = seriesDiffY2[i].split("--")[0].split(" ");
                        var name1 = "";
                        for (var k = 0; k < name1Arr.length; k++) {
                            if (group_name_to_value_map[name1Arr[k]] != null) {
                                name1 = name1 + group_name_to_value_map[name1Arr[k]].join() + " ";
                            } else {
                                name1 = name1 + name1Arr[k] + " ";
                            }
                        }
                        name1 = name1.substring(0, name1.length-1);
                        var name2Arr = seriesDiffY2[i].split("--")[1].split(" ");
                        var name2 = "";
                        for (var k = 0; k < name2Arr.length; k++) {
                            if (group_name_to_value_map[name2Arr[k]] != null) {
                                name2 = name2 + group_name_to_value_map[name2Arr[k]].join() + " ";
                            } else {
                                name2 = name2 + name2Arr[k] + " ";
                            }
                        }
                        name2 = name2.substring(0, name2.length-1);
            seriesDiffY2List.push('c("' + name1 + '","' + name2 + '")');
        }
    }


    //  <tmpl>
    var divTitleLab = document.getElementById("divTitleLab");
    listInput = divTitleLab.getElementsByTagName("input");
    strDepXML += "<tmpl>";
    strDepXML += "<title>" + listInput[0].value + "</title>";
    strDepXML += "<x_label>" + listInput[1].value + "</x_label>";
    strDepXML += "<y1_label>" + listInput[2].value + "</y1_label>";
    strDepXML += "<y2_label>" + listInput[3].value + "</y2_label>";
    strDepXML += "<caption>" + listInput[4].value + "</caption>";
    strDepXML += "<listDiffSeries1>list(" + seriesDiffY1List.join() + ")</listDiffSeries1>";
    strDepXML += "<listDiffSeries2>list(" + seriesDiffY2List.join() + ")</listDiffSeries2>";
    strDepXML += "</tmpl>";

    //  bool formatting
    var tabFmtPlotBool = document.getElementById("tabFmtPlotBool");
    for (var i = 0; i < tabFmtPlotBool.rows.length; i++) {
        for (var j = 0; j < tabFmtPlotBool.rows[i].cells.length; j++) {
            var listTdBool = tabFmtPlotBool.rows[i].cells[j].getElementsByTagName("td");
            if (1 > listTdBool.length) {
                continue;
            }
            var strTag = getFmtTag(tabFmtPlotBool.rows[i].cells[j]);
            var strVal = getFmtVal(tabFmtPlotBool.rows[i].cells[j]);
            if (chkAggStat != undefined && chkAggStat.checked && strTag.match(/_diff$/)) {
                strVal = "false";
            }
            strDepXML += "<" + strTag + ">" + strVal + "</" + strTag + ">";
        }
    }

    //  txt formatting
    var tabFmtPlotTxt = document.getElementById("tabFmtPlotTxt");
    for (var i = 0; i < tabFmtPlotTxt.rows.length; i++) {
        for (var j = 0; j < tabFmtPlotTxt.rows[i].cells.length; j++) {
            var listTdTxt = tabFmtPlotTxt.rows[i].cells[j].getElementsByTagName("td");
            if (1 > listTdTxt.length) {
                continue;
            }
            var strTag = getFmtTag(tabFmtPlotTxt.rows[i].cells[j]);
            var strVal = getFmtVal(tabFmtPlotTxt.rows[i].cells[j]);
            strDepXML += "<" + strTag + ">" + strVal + "</" + strTag + ">";
        }
    }

    //  series formatting
    var listFmtSeries = new Array("", "", "", "", "", "", "", "", "", "");
    var boolLegend = false;
    if (TMPL_RHIST == _intTmpl) {
        var tabFmtSeries = document.getElementById("tabFmtSeriesRhistVal");
        listFmtSeries[0] = "TRUE";
        listFmtSeries[1] = "\"none\"";
        listFmtSeries[2] = "\"" + getFmtVal(tabFmtSeries.rows[0].cells[0]) + "\"";
        listFmtSeries[3] = "20";
        listFmtSeries[4] = "\"b\"";
        listFmtSeries[5] = "1";
        listFmtSeries[6] = getFmtVal(tabFmtSeries.rows[1].cells[0]);
        listFmtSeries[7] = "1";
        listFmtSeries[8] = "\"" + getFmtVal(tabFmtSeries.rows[2].cells[0]) + "\"";
        boolLegend = ("" != listFmtSeries[8]);
    } else if (TMPL_ROC == _intTmpl) {
        var tabFmtSeries1 = document.getElementById("tabFmtSeriesRoc1");
        var tabFmtSeries2 = document.getElementById("tabFmtSeriesRoc2");
        listFmtSeries[0] = "TRUE";
        listFmtSeries[1] = "\"none\"";
        listFmtSeries[2] = "\"" + getFmtVal(tabFmtSeries1.rows[0].cells[0]) + "\"";
        listFmtSeries[3] = getFmtVal(tabFmtSeries1.rows[1].cells[0]);
        listFmtSeries[4] = "\"" + getFmtVal(tabFmtSeries1.rows[2].cells[0]) + "\"";
        listFmtSeries[5] = getFmtVal(tabFmtSeries2.rows[0].cells[0]);
        listFmtSeries[6] = getFmtVal(tabFmtSeries2.rows[1].cells[0]);
        listFmtSeries[7] = "1";
        listFmtSeries[8] = "";
        boolLegend = false;
    } else if (TMPL_RELY == _intTmpl) {
        var tabFmtSeries1 = document.getElementById("tabFmtSeriesRely1");
        var tabFmtSeries2 = document.getElementById("tabFmtSeriesRely2");
        var tabFmtSeries3 = document.getElementById("tabFmtSeriesRely3");
        var tabFmtSeries4 = document.getElementById("tabFmtSeriesRely4");
        listFmtSeries[0] = "TRUE, TRUE";
        listFmtSeries[1] = "\"none\", \"none\"";
        listFmtSeries[2] = "\"" + getFmtVal(tabFmtSeries1.rows[0].cells[0]) + "\", " +
                "\"" + getFmtVal(tabFmtSeries3.rows[0].cells[0]) + "\"";
        listFmtSeries[3] = getFmtVal(tabFmtSeries1.rows[1].cells[0]) + ", " +
                getFmtVal(tabFmtSeries3.rows[1].cells[0]);
        listFmtSeries[4] = "\"" + getFmtVal(tabFmtSeries1.rows[2].cells[0]) + "\", " +
                "\"" + getFmtVal(tabFmtSeries3.rows[2].cells[0]) + "\"";
        listFmtSeries[5] = getFmtVal(tabFmtSeries2.rows[0].cells[0]) + ", " +
                getFmtVal(tabFmtSeries4.rows[0].cells[0]);
        listFmtSeries[6] = getFmtVal(tabFmtSeries2.rows[1].cells[0]) + ", " +
                getFmtVal(tabFmtSeries4.rows[1].cells[0]);
        listFmtSeries[7] = "1, 1";
        listFmtSeries[8] = "";
        boolLegend = false;
    } else {
        var tabFmtSeries = document.getElementById("tabFmtSeries");
        for (var intRow = 0; intRow < tabFmtSeries.rows.length; intRow += 2) {
            var listFmtTd = getFmtSeriesVal(intRow);
            for (var i = 0; i < listFmtSeries.length; i++) {
                var strVal = "";
                if (i == 0) {
                    strVal = (getFmtSeriesHide(intRow) ? "FALSE" : "TRUE");
                } else if (i != 9) {
                    strVal = getFmtVal(listFmtTd[i - 1]);
                }
                if (8 == i && strVal != "") {
                    boolLegend = true;
                }
                if (1 == i || 2 == i || 4 == i || 8 == i) {
                    strVal = "\"" + strVal + "\"";
                }
                if (i == 9) {
                    strVal = tabFmtSeries.rows[intRow].cells[0].getElementsByTagName("input")[2].value;
                }
                listFmtSeries[i] += (0 < intRow ? ", " : "") + strVal;
            }
        }
    }
    strDepXML += "<plot_ci>c(" + listFmtSeries[1] + ")</plot_ci>";
    strDepXML += "<plot_disp>c(" + listFmtSeries[0] + ")</plot_disp>";
    strDepXML += "<colors>c(" + listFmtSeries[2] + ")</colors>";
    strDepXML += "<pch>c(" + listFmtSeries[3] + ")</pch>";
    strDepXML += "<type>c(" + listFmtSeries[4] + ")</type>";
    strDepXML += "<lty>c(" + listFmtSeries[5] + ")</lty>";
    strDepXML += "<lwd>c(" + listFmtSeries[6] + ")</lwd>";
    strDepXML += "<con_series>c(" + listFmtSeries[7] + ")</con_series>";
    if (boolLegend) {
        strDepXML += "<legend>c(" + listFmtSeries[8] + ")</legend>";
    }
    strDepXML += "<order_series>c(" + listFmtSeries[9] + ")</order_series>";


    var strPlotCmd = document.getElementById("txtPlotCmd").value;
    if ("" != strPlotCmd) {
        strDepXML += "<plot_cmd>" + strPlotCmd + "</plot_cmd>";
    }

    //  axis formatting
    var divFmtAxis = document.getElementById("divFmtAxis");
    listInput = divFmtAxis.getElementsByTagName("input");
    strDepXML += "<y1_lim>" + listInput[0].value + "</y1_lim>";
    strDepXML += "<y1_bufr>" + listInput[1].value + "</y1_bufr>";
    strDepXML += "<y2_lim>" + listInput[2].value + "</y2_lim>";
    strDepXML += "<y2_bufr>" + listInput[3].value + "</y2_bufr>";


    return strDepXML;
}

/**
 * Build an XML structure with specified field tag and value tag from the
 * information selected in the specified list of div controls
 */
function buildFieldValSeriesXML(strFieldTag, strValTag, listDiv, boolDep, boolSet) {
    var strXML = "";
    var tabField = new Hashtable();
    var listField = [];
    var listFieldIndex=0;
    for (i in listDiv) {

        //  get the field value and format it
        var listSel = listDiv[i].getElementsByTagName("select");
        var strVar = getSelected(listSel[0])[0];
        if (boolDep) { /* strVar = strVar.toUpperCase(); */
        }
        else {
            strVar = strVar.toLowerCase();
        }

        //  get the selected stats/values and format them
        var listVal = getSelected(listSel[1]);
        var isGroup = listDiv[i].getElementsByTagName("input")[1].checked;

        if(isGroup){
            var groupName = listVal.join();
            listVal = [groupName];
        }


        if (1 > listVal.length) {
            continue;
        }
        if (boolDep) {
            for (j in listVal) {
                listVal[j] = buildModeStatCode(listVal[j], listDiv[i]);
            }
        }

        //  build the XML for the list of values
        var strValXML = "";
        for (j in listVal) {
            strValXML += "<" + strValTag + ">" + escapeXml(listVal[j]) + "</" + strValTag + ">";
        }
        listField[listFieldIndex] = strVar;
        tabField.put(listFieldIndex.toString(), strValXML );
        listFieldIndex++;
    }

    //  build the XML for each field stored in the table
    for (var i=0; i<  listField.length; i++) {
        var strVar = listField[i];
        strXML += "<" + strFieldTag + " name=\"" + strVar + "\">";
        if (boolSet) {
            strXML += "<set name=\"" + strVar + "_" + i + "\">";
        }
        strXML += tabField.get(i.toString());
        if (boolSet) {
            strXML += "</set>";
        }
        strXML += "</" + strFieldTag + ">";
    }

    return strXML;
}




function buildFieldValXML(strFieldTag, strValTag, listDiv, boolDep, boolSet) {
    var strXML = "";
    var tabField = new Hashtable();
    var listField = [];
    for (i in listDiv) {

        //  get the field value and format it
        var listSel = listDiv[i].getElementsByTagName("select");
        var strVar = getSelected(listSel[0])[0];
        if (boolDep) { /* strVar = strVar.toUpperCase(); */
        }
        else {
            strVar = strVar.toLowerCase();
        }

        //  get the selected stats/values and format them
        var listVal = getSelected(listSel[1]);
        var isGroup = false;
        if(listDiv[i].id.startsWith("divFieldVal")){
            isGroup= listDiv[i].getElementsByTagName("input")[1].checked;
        }
        if(isGroup){
            var groupName = listVal.join();
            listVal = [groupName];
        }


        if (1 > listVal.length) {
            continue;
        }
        if (boolDep) {
            for (j in listVal) {
                listVal[j] = buildModeStatCode(listVal[j], listDiv[i]);
            }
        }

        //  build the XML for the list of values
        var strValXML = "";
        for (j in listVal) {
            strValXML += "<" + strValTag + ">" + escapeXml(listVal[j]) + "</" + strValTag + ">";
        }
        var strValXMLCur = tabField.get(strVar);
        listField.push(strVar);
        tabField.put(strVar, (undefined == strValXMLCur ? strValXML : strValXMLCur + strValXML));
    }

    //  build the XML for each field stored in the table
    var keys = tabField.listKeys();
    for (var i=0; i< keys.length; i++) {
        var strVar = keys[i];
        strXML += "<" + strFieldTag + " name=\"" + strVar + "\">";
        if (boolSet) {
            strXML += "<set name=\"" + strVar + "_" + i + "\">";
        }
        strXML += tabField.get(strVar);
        if (boolSet) {
            strXML += "</set>";
        }
        strXML += "</" + strFieldTag + ">";
    }

    return strXML;
}

function buildFieldValXMLSeries(strFieldTag, strValTag, listDiv, boolDep, boolSet) {
    var strXML = "";
    var tabField = new Hashtable();
    var listField = [];
    for (var i=0; i< listDiv.length; i++) {

        //  get the field value and format it
        var listSel = listDiv[i].getElementsByTagName("select");
        var strVar = getSelected(listSel[0])[0];
        if (boolDep) { /* strVar = strVar.toUpperCase(); */
        }
        else {
            strVar = strVar.toLowerCase();
        }

        //  get the selected stats/values and format them
        var listVal = getSelected(listSel[1]);
        var isGroup = false;
        if(listDiv[i].id.startsWith("divFieldVal")){
            isGroup= listDiv[i].getElementsByTagName("input")[1].checked;
        }
        if(isGroup){
            var groupName = listVal.join();
            listVal = [groupName];
        }


        if (1 > listVal.length) {
            continue;
        }
        if (boolDep) {
            for (j in listVal) {
                listVal[j] = buildModeStatCode(listVal[j], listDiv[i]);
            }
        }

        //  build the XML for the list of values
        var strValXML = "";
        for (j in listVal) {
            strValXML += "<" + strValTag + ">" + escapeXml(listVal[j]) + "</" + strValTag + ">";
        }

        listField[i] = strVar;

        tabField.put(i, strValXML);
    }

    //  build the XML for each field stored in the table

    for (var i=0; i< listField.length; i++) {
        var strVar = listField[i];
        strXML += "<" + strFieldTag + " name=\"" + strVar + "\">";
        if (boolSet) {
            strXML += "<set name=\"" + strVar + "_" + i + "\">";
        }
        strXML += tabField.get(i);
        if (boolSet) {
            strXML += "</set>";
        }
        strXML += "</" + strFieldTag + ">";
    }

    return strXML;
}
/**
 * If the specified statistic is a mode statistic that requires a code suffix,
 * determine the suffix from the controls of the specified divDep, add them to
 * the specified stat and return it
 */
function buildModeStatCode(stat, divDep) {

    //  if the input stat does not need a code suffix, return it
    if ("mode" != _strPlotData ||
            null != stat.match(/^RATIO_.+/) ||
            null != stat.match(/^AREARAT_.+/) ||
            null != stat.match(/^OBJ.+/)) {
        return stat;
    }

    //  determine the first letter of the code [A|F|O|D]
    var boolDiff = divDep.getElementsByTagName("input")[3].checked;
    var boolFcst = divDep.getElementsByTagName("input")[4].checked;
    var boolObs = divDep.getElementsByTagName("input")[5].checked;
    var strCode = "_";
    if (-1 < listSearch(stat, _listStatModeSingle)) {
        if (boolDiff) {
            strCode += "D";
        }
        else if (boolFcst && boolObs) {
            strCode += "A";
        }
        else if (boolFcst) {
            strCode += "F";
        }
        else if (boolObs) {
            strCode += "O";
        }
        else {
            strCode += "A";
        }
    }

    //  if the stat is ACOV, return the code
    if (null != stat.match(/^ACOV$/)) {
        return stat + strCode + "SA";
    }

    //  determine the second letter of the code [A|S|C]
    var boolSimp = divDep.getElementsByTagName("input")[6].checked;
    var boolClus = divDep.getElementsByTagName("input")[7].checked;
    if (boolSimp && boolClus) {
        strCode += "A";
    }
    else if (boolSimp) {
        strCode += "S";
    }
    else if (boolClus) {
        strCode += "C";
    }
    else {
        strCode += "A";
    }

    //  determine the third letter of the code [A|M|U]
    var boolMat = divDep.getElementsByTagName("input")[8].checked;
    var boolUnm = divDep.getElementsByTagName("input")[9].checked;
    if (boolMat && boolUnm) {
        strCode += "A";
    }
    else if (boolMat) {
        strCode += "M";
    }
    else if (boolUnm) {
        strCode += "U";
    }
    else {
        strCode += "A";
    }

    return stat + strCode;
}

function runPlotReq() {
    sendRequest("POST", "<plot>" + buildPlotXML() + "</plot>", runPlotResp);
}
function runPlotResp(strResp) {
    if (null != (listProc = strResp.match(/<r_error>([\s\S]*)<\/r_error>/))) {
        alert("R error message:\n" + listProc[1]);
    }
    if (null != (listProc = strResp.match(/<plot>(.*)<\/plot>/))) {
        var strPlot = listProc[1];
        var win = window.open("plot.html", strPlot);
    }
}

function testPlotResp() {
    runPlotResp("<plot>plot_00021_20100810_084037</plot>");
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * Init XML Controls
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Each loadInitXML function performs a step of the XML upload initialization
 * process, then calls the loadSleep() function, passing it the next function in
 * the chain. When the callback for the current initiazation step is complete,
 * the next function in the chain will be called. Each function parses the
 * appropriate section of the init XML stored in the _strInitXML data member.
 */
function loadInitXML(strInitXML) {
    debug("loadInitXML() - initializing with xml:\n" + strInitXML + "\n\n");
    _strInitXML = strInitXML;
    _boolDimOverride = true;
    dimScreen(true);
    _boolInitXML = true;
    _intInitXMLChecks = 0;
    setTimeout("loadInitXML_checkProg()", _intInitXMLCheckWait);
    loadSleep("loadInitXML_phaseDB()");
}

var _boolInitXML = false;
var _intInitXMLChecks = 0;
var _intInitXMLChecksMax = 0;
var _intInitXMLCheckMax = 5;
var _intInitXMLCheckWait = 2000;

/**
 * Periodically check the progress of the XML load, making sure that it is not
 * stuck.  If the load does get stuck, print an error message indicating that
 * there has been an error.  Otherwise, do nothing.
 */
function loadInitXML_checkProg() {

    //  if the load is complete, stop checking
    if (!_boolInitXML) {
        return;
    }

    //  if there is an ongoing server request, set the next check
    if (_boolLoad) {
        _intInitXMLChecks = 0;
        setTimeout("loadInitXML_checkProg()", _intInitXMLCheckWait);
        return;
    }

    //  if the number of checks has not been exceeded, increment
    if (_intInitXMLChecks < _intInitXMLCheckMax) {
        _intInitXMLChecks++;
        if (_intInitXMLChecks > _intInitXMLChecksMax) {
            _intInitXMLChecksMax = _intInitXMLChecks;
        }
        setTimeout("loadInitXML_checkProg()", _intInitXMLCheckWait);
    }

    //  if the number of checks has been exceeded, report an error
    else {
        alert("ERROR: javascript error loading XML");
        _boolDimOverride = false;
        dimScreen(false);
        _boolInitXML = false;
    }
}

/**
 * Parse the name of the plot database from _strInitXML, set the database select
 * box and then call the plot_type handler.
 */
function loadInitXML_phaseDB() {
    debug("loadInitXML_phaseDB()\n\n");
    _strDBCon = _strInitXML.match(/<database>(.*)<\/database>/)[1];
    setSelected(document.getElementById("selDB"), _strDBCon);
    loadSleep("loadInitXML_phasePlotType()");
}

/**
 * Parse the plot_type from _strInitXML using assumptions about the first stat
 * name, set the plot_data select box and then call the plot_tmpl handler.
 */
function loadInitXML_phasePlotType() {
    debug("loadInitXML_phasePlotType()\n\n");
    var listStat = _strInitXML.match(/<stat>(\w+)<\/stat>/);
    var strStat = (null != listStat ? listStat[1] : "");
    setSelected(document.getElementById("selPlotData"), isModeStat(strStat) ? "MODE" : "Stat");
    updatePlotData();
    loadSleep("loadInitXML_phaseTmpl()");
}

/**
 * Parse the plot_tmpl from _strInitXML, set the plot_tmpl select box and then
 * call the dep handler.
 */
function loadInitXML_phaseTmpl() {
    debug("loadInitXML_phaseTmpl()\n\n");
    _strInitXMLPlotTmpl = _strInitXML.match(/<template>(.*)\.R_tmpl<\/template>/)[1];
    setSelected(document.getElementById("selTemplate"), _strInitXMLPlotTmpl);
    updateTmpl();
    if (isTmplSpc()) {
        loadSleep("loadInitXML_phasePlotFix()");
    }
    else {
        loadSleep("loadInitXML_phaseDep()");
    }
}

//  data structures for managing dep fcst_var/stat pairs
var _tableInitXMLDep1 = new Hashtable();
var _listInitXMLDep1 = new Array();
var _tableInitXMLDep2 = new Hashtable();
var _listInitXMLDep2 = new Array();
var _divInitXMLDep;

/**
 * Parse the _strInitXML dep information and build hashtables and lists
 * containing the fcst_vars and fcst_var/stat pairs. Then, start the chain of
 * calls to load dep controls with those pairs.
 */
function loadInitXML_phaseDep() {
    debug("loadInitXML_phaseDep()\n\n");

    //  parse the dep 1 structures, creating a hashtable entry for each fcst_var
    var strDep1 = _strInitXML.match(/<dep1>(.*)<\/dep1>/)[1];
    loadInitXML_buildMap(strDep1, "fcst_var", _tableInitXMLDep1, _listInitXMLDep1);

    //  parse the dep 2 structures, creating a hashtable entry for each fcst_var
    if (null == _strInitXML.match(/<dep2\/>/)) {
        var strDep2 = _strInitXML.match(/<dep2>(.*)<\/dep2>/)[1];
        loadInitXML_buildMap(strDep2, "fcst_var", _tableInitXMLDep2, _listInitXMLDep2);
    }

    //  start the dep load cycle
    if (TMPL_ENS_SS != _intTmpl) loadInitXML_phaseDepLoad();
    else                          loadInitXML_phaseSeries();
}

/**
 * Parse the specified xml, which is assumed to contain fcst_var blocks with
 * value lists, into fcst_var/value (stat or val) pairs and enter each into the
 * specified Hashtable.
 */
function loadInitXML_buildMap(xml, field, map, list) {
    var strFcstVar = xml;
    var reg = new RegExp("<" + field + " name=\"([^\"]+)\">(.*?)<\/" + field + ">(.*)");
    while (null != (listFcstVar = strFcstVar.match(reg))) {

        //  remove the enclosing <set>, if necessary
        var strVal = listFcstVar[2];
        strVal = strVal.replace(/<set name=\"\w*\">/, "");
        strVal = strVal.replace(/<\/set>/, "");

        //  add the list of values to the map with the field name as key
        map.put(listFcstVar[1], strVal);
        list.push(listFcstVar[1]);
        strFcstVar = listFcstVar[3];
    }
}


function loadInitXML_buildMap_Series(xml, field, map, list) {
    var strFcstVar = xml;
    var reg = new RegExp("<" + field + " name=\"([^\"]+)\">(.*?)<\/" + field + ">(.*)");
    var index = 0;
    while (null != (listFcstVar = strFcstVar.match(reg))) {

        //  remove the enclosing <set>, if necessary
        var strVal = listFcstVar[2];
        strVal = strVal.replace(/<set name=\"\w*\">/, "");
        strVal = strVal.replace(/<\/set>/, "");

        //  add the list of values to the map with the field name as key
        list[index]=listFcstVar[1];

        map.put(index, strVal);

        strFcstVar = listFcstVar[3];
        index++;
    }
}

/**
 * Recursively loop through the constructed lists of dep fcst_vars, listing the
 * available stats and then selecting them according to the stat information for
 * each fcst_var in the tables. The current fcst_var/stat dep div is set and
 * passed among the functions to update the controls. When the lists are empty,
 * the series loading function is called.
 */
function loadInitXML_phaseDepLoad() {
    debug("loadInitXML_phaseDepLoad()\n");

    //  if there is a currently loaded stat list, select the stats
    if (_divInitXMLDep != undefined) {
        loadInitXML_phaseDepStats();
    }

    //  if there are no more dep fcst_vars to load, continue to series
    if (1 > _listInitXMLDep1.length && 1 > _listInitXMLDep2.length) {
        debug("loadInitXML_phaseDepLoad() complete\n\n");
        loadSleep("loadInitXML_phaseSeries()");

        return;
    }

    //  determine the current div dep to set controls for, adding one if necessary
    var intDep = 1;
    var listDep = _listDep1Div;
    if (_divInitXMLDep == undefined) {
        debug("  dep1 first\n");
        _divInitXMLDep = _listDep1Div[0];
    } else {
        debug("  dep" + intDep + " new\n");
        if (1 > _listInitXMLDep1.length) {
            intDep = 2;
            listDep = _listDep2Div;
        }
        addDep(intDep);
        _divInitXMLDep = listDep[ listDep.length - 1 ];
    }

    //  load the stats for the next fcst_var
    debug("  divDep = " + _divInitXMLDep + "  id = " + getDivDepId(_divInitXMLDep) + "\n");
    var strFcstVar = ( 1 == intDep ? _listInitXMLDep1[0] : _listInitXMLDep2[0] );
    debug("  fsct_var = " + strFcstVar + "  select = " + _divInitXMLDep.getElementsByTagName("select")[0] + "\n");
    setSelected(_divInitXMLDep.getElementsByTagName("select")[0], strFcstVar);
    selectFcstVarReq(getDivDepId(_divInitXMLDep));

    //  wait for the current fcst_var load to finish, then repeat
    debug("\n");
    loadSleep("loadInitXML_phaseDepLoad()");


}

/**
 * Examine the fcst_var lists to determine the next one whose stats must be
 * parsed and selected, removing the fcst_var from the list. The list of stats
 * is parsed and selected in the stats list control. The MODE checkboxes are
 * updated, if appropriate.
 */
function loadInitXML_phaseDepStats() {

    //  for a MODE plot, take only the first stat and replace the rest
    var strStats = "";
    if (_strPlotData == "mode") {
        var listInitXMLDep = 0 < _listInitXMLDep1.length ? _listInitXMLDep1 : _listInitXMLDep2;
        var tabInitXMLDep = 0 < _listInitXMLDep1.length ? _tableInitXMLDep1 : _tableInitXMLDep2;

        strStats = tabInitXMLDep.get(listInitXMLDep[0]);
        var listStats = strStats.match(/(<stat>[^<]*<\/stat>)(.*)/);
        strStats = listStats[1];
        if ("" == listStats[2]) {
            listInitXMLDep.shift();
        }
        else {
            tabInitXMLDep.put(listInitXMLDep[0], listStats[2]);
        }
    }

    //  otherwise, use all stats for the next fcst_var
    else {
        if (0 < _listInitXMLDep1.length) {
            strStats = _tableInitXMLDep1.get(_listInitXMLDep1.shift());
        }
        else if (0 < _listInitXMLDep2.length) {
            strStats = _tableInitXMLDep2.get(_listInitXMLDep2.shift());
        }
    }
    debug("  stats: " + strStats + "\n");

    //  parse the stats and select them in the dep stat list
    strStats = strStats.match(/<stat>(.*)<\/stat>/)[1];
    listStats = strStats.split(/<\/stat><stat>/);
    listStatsSel = new Array();
    var listMode;
    for (i in listStats) {

        //  parse the stat name, including the MODE suffix, if appropriate
        var strStat = listStats[i];
        if (null == listStats[i].match(/^RATIO_.+/) &&
                null == listStats[i].match(/^AREARAT_.+/) &&
                null == listStats[i].match(/^OBJ.+/) &&
                null != (listMode = listStats[i].match(/^(\w+)_([FODA])?([SCA])([MUA])$/))) {
            strStat = listMode[1];
        }

        for (j in listMode) {
            debug("      listMode[" + j + "] = " + listMode[j] + "\n");
        }

        //  select the stat in the stat list
        listStatsSel.push(strStat);
        debug("    stat: " + listStats[i] + " - parsed stat: " + strStat + "\n");
    }
    setSelected(_divInitXMLDep.getElementsByTagName("select")[1], listStatsSel);

    //  if there is a stat MODE suffix, check the appropriate boxes
    if (null != listMode) {
        debug("    checking MODE boxes - listMode.length = " + listMode.length + "\n");

        //  determine the MODE checkbox configuration
        var strChkFODA = (undefined == listMode[2] ? "" : listMode[2]);
        debug("      strChkFODA = " + strChkFODA + "\n");

        //  set up the checkboxes for first letter of the code [A|F|O|D]
        _divInitXMLDep.getElementsByTagName("input")[3].checked = (null != strChkFODA.match(/D/));
        _divInitXMLDep.getElementsByTagName("input")[4].checked = (null != strChkFODA.match(/[AF]/));
        _divInitXMLDep.getElementsByTagName("input")[5].checked = (null != strChkFODA.match(/[AO]/));

        //  set up the checkboxes for the second letter of the code [A|S|C]
        _divInitXMLDep.getElementsByTagName("input")[6].checked = (null != listMode[3].match(/[AS]/));
        _divInitXMLDep.getElementsByTagName("input")[7].checked = (null != listMode[3].match(/[AC]/));

        //  set up the checkboxes for the third letter of the code [A|M|U]
        _divInitXMLDep.getElementsByTagName("input")[8].checked = (null != listMode[4].match(/[AM]/));
        _divInitXMLDep.getElementsByTagName("input")[9].checked = (null != listMode[4].match(/[AU]/));
    }
    updateDepStat(getDivDepId(_divInitXMLDep));
    debug("  stats done\n");
}

//  data structures for managing series field/val pairs
var _tableInitXMLSeries1 = new Hashtable();
var _listInitXMLSeries1 = new Array();
var _tableInitXMLSeries2 = new Hashtable();
var _listInitXMLSeries2 = new Array();
var _divInitXMLSeries;

/**
 * Parse the _strInitXML series information and build hashtables and lists
 * containing the field and field/val pairs. Then, start the chain of calls to
 * load series controls with the pairs.
 */

function loadInitXML_phaseSeries() {
    debug("loadInitXML_phaseSeries()\n\n");

    //  parse the series 1 structures, creating a hashtable entry for each field
    var strSeries1 = _strInitXML.match(/<series1>(.*)<\/series1>/)[1];
    loadInitXML_buildMap_Series(strSeries1, "field", _tableInitXMLSeries1, _listInitXMLSeries1);

    //  parse the series 2 structures, creating a hashtable entry for each field
    if (null == _strInitXML.match(/<series2\/>/)) {
        var strSeries2 = _strInitXML.match(/<series2>(.*)<\/series2>/)[1];
        loadInitXML_buildMap_Series(strSeries2, "field", _tableInitXMLSeries2, _listInitXMLSeries2);
    }

    //  start the series load cycle
    loadInitXML_phaseSeriesLoad();
}

/**
 * Recursively loop through the constructed lists of series fields, listing the
 * available values and then selecting them according to the val information for
 * each field in the tables. The current field/val series div is set and passed
 * among the functions to update the controls. When the lists are empty, the
 * plot_fix loading function is called.
 */
var _listInitXMLSeries1Index=0, _listInitXMLSeries2Index=0;
function loadInitXML_phaseSeriesLoad() {
    debug("loadInitXML_phaseSeriesLoad()\n");

    //  if there is a currently loaded val list, select the values
    var _listInitXMLSeries, _tableInitXMLSeries, series;

    if (_divInitXMLSeries != undefined) {
        if( _listInitXMLSeries1Index < _listInitXMLSeries1.length ){
            _listInitXMLSeries= _listInitXMLSeries1;
            _tableInitXMLSeries = _tableInitXMLSeries1;
            series =1;
        }else{
            _listInitXMLSeries= _listInitXMLSeries2;
            _tableInitXMLSeries = _tableInitXMLSeries2;
            series = 2;
        }

        loadInitXML_updateFieldValsSeries(_listInitXMLSeries,_tableInitXMLSeries,_divInitXMLSeries,true, series);

    }

    //  if there are no more series fcst_vars to load, continue to plot_fix values
    if (_listInitXMLSeries1Index == _listInitXMLSeries1.length && _listInitXMLSeries2Index == _listInitXMLSeries2.length) {
        debug("loadInitXML_phaseSeriesLoad() complete\n\n");
        loadSleep("loadInitXML_phasePlotFix()");
        return;
    }

    //  determine the current div series to set controls for, adding one if necessary
    var intSeries = 1;
    var listSeries = _listSeries1Div;
    if (_divInitXMLSeries == undefined) {
        debug("  series1 first - _listSeries1Div.length = " + _listSeries1Div.length + "\n");
        _divInitXMLSeries = _listSeries1Div[0];
    } else {
        if (_listInitXMLSeries1Index == _listInitXMLSeries1.length) {
            intSeries = 2;
            listSeries = _listSeries2Div;
        }
        debug("  series" + intSeries + " new\n");
        addSeriesDiv(intSeries);
        _divInitXMLSeries = listSeries[ listSeries.length - 1 ];
    }

    //  load the stats for the next fcst_var
    debug("  divSeries = " + _divInitXMLSeries + "  id = " + _divInitXMLSeries.id + "\n");
    var strFcstVar = ( 1 == intSeries ? _listInitXMLSeries1[_listInitXMLSeries1Index] : _listInitXMLSeries2[_listInitXMLSeries2Index] );
    debug("  field = " + strFcstVar + "  select = " + _divInitXMLSeries.getElementsByTagName("select")[0] + "\n" +
            "  div id = " + _divInitXMLSeries.id + "\n");
    setSelected(_divInitXMLSeries.getElementsByTagName("select")[0], strFcstVar.toUpperCase());
    if (1 == intSeries) {
        selectSeries1VarReq(getDivFieldValId(_divInitXMLSeries));
    }
    else {
        selectSeries2VarReq(getDivFieldValId(_divInitXMLSeries));
    }


    //  wait for the current fcst_var load to finish, then repeat
    debug("\n");
    loadSleep("loadInitXML_phaseSeriesLoad()");
}

/**
 * After removing the first field on the input list, extract the corresponding
 * list of vals from the specified table. Parse the list of vals and then select
 * them in the val select control contained in the specified fieldVal div.  If
 * the order input is true, the fields will be set to the order in which they
 * appear in the val list.
 */
function loadInitXML_updateFieldVals(list, table, div, order) {

    //  determine the list of vals to parse and select
    var strVals = "";
    strVals = table.get(list.shift());
    debug("  vals = " + strVals + "\n  select = " + div.getElementsByTagName("select")[1] + "\n");

    //  resolve the select control and parse the div id
    var selVal = div.getElementsByTagName("select")[1];
    intId = div.id.match(/divFieldVal(\d+)/)[1];

    //  parse the vals and select them in the series val list
    strVals = strVals.match(/<val>(.*)<\/val>/)[1];
    listVals = strVals.split(/<\/val><val>/); /// ["EnKF,GSI3", "GSI3,WRF"]
    listValsSel = new Array();
    for (var i = listVals.length - 1; i >= 0; i--) {
        debug("    val = " + listVals[i] + "\n");
        var val = listVals[i];
        var valArray = val.split(",");
        if(valArray.length > 0){
            val = valArray;
        }
        listValsSel.unshift(val);
        if (order) {
            setSelected(selVal, val);
            while (0 != moveFieldUp(div, intId)) {
            }
        }
    }
    setSelected(div.getElementsByTagName("select")[1], listValsSel);
}

function loadInitXML_updateFieldValsSeries(list, table, div, order, series) {

    //  determine the list of vals to parse and select
    var strVals = "";
    if(series ==1){
        strVals = table.get(_listInitXMLSeries1Index);
        _listInitXMLSeries1Index++;
    }else{
        strVals = table.get(_listInitXMLSeries2Index);
                _listInitXMLSeries2Index++;
    }

    debug("  vals = " + strVals + "\n  select = " + div.getElementsByTagName("select")[1] + "\n");

    //  resolve the select control and parse the div id
    var selVal = div.getElementsByTagName("select")[1];
    intId = div.id.match(/divFieldVal(\d+)/)[1];

    //  parse the vals and select them in the series val list
    strVals = strVals.match(/<val>(.*)<\/val>/)[1];
    listVals = strVals.split(/<\/val><val>/); /// ["EnKF,GSI3", "GSI3,WRF"]
    listValsSel = [];
    for (var i = listVals.length - 1; i >= 0; i--) {
        debug("    val = " + listVals[i] + "\n");
        var val = listVals[i];
        var valArray = val.split(",");
        if(valArray.length > 0){
            val = valArray;
        }
        //check group
        if(valArray.length > 1){
            div.getElementsByTagName("input")[1].checked=true;
        }
        for(var k=0; k< val.length; k++){
            listValsSel.unshift(val[k]);
        }

        //setSelected(selVal, val);
        if (order) {
            while (0 != moveFieldUp(div, intId)) {
            }
        }

    }
    setSelected(div.getElementsByTagName("select")[1], listValsSel);
}

//  data structures for managing plot_fix field/val pairs
var _tableInitXMLPlotFix = new Hashtable();
var _listInitXMLPlotFix = new Array();
var _divInitXMLPlotFix;

/**
 * Parse the _strInitXML plot_fix information and build hashtables and lists
 * containing the field and field/val pairs. Then, start the chain of calls to
 * load plot_fix controls with the pairs.
 */
function loadInitXML_phasePlotFix() {
    debug("loadInitXML_phasePlotFix()\n");

    //  parse the plot_cond value
    var strPlotCond = _strInitXML.match(/<plot_cond>(.*)<\/plot_cond>/)[1];
    if (isTmplSpc()) {
        document.getElementById("txtPlotCondSpc").value = strPlotCond;
    }
    else {
        document.getElementById("txtPlotCond").value = strPlotCond;
    }

    //  parse the plot_fix structures, creating a hashtable entry for each field
    var strPlotFix = _strInitXML.match(/<plot_fix>(.*)<\/plot_fix>/)[1];
    loadInitXML_buildMap(strPlotFix, "field", _tableInitXMLPlotFix, _listInitXMLPlotFix);

    //  start the series load cycle
    loadInitXML_phasePlotFixLoad();
}

/**
 * Recursively loop through the constructed lists of plot_fix fields, listing
 * the available values and then selecting them according to the val information
 * for each field in the tables. The current field/val plot_fix div is set and
 * passed among the functions to update the controls. When the lists are empty,
 * the indy loading function is called.
 */
function loadInitXML_phasePlotFixLoad() {

    //  if there is a currently loaded val list, select the values
    if (_divInitXMLPlotFix != undefined) {
        loadInitXML_updateFieldVals(_listInitXMLPlotFix,
                _tableInitXMLPlotFix,
                _divInitXMLPlotFix,
                false);
    }

    //  if there are no more series fcst_vars to load, continue to plot_fix values
    if (1 > _listInitXMLPlotFix.length) {
        debug("loadInitXML_phasePlotFixLoad() complete\n\n");

        //  go to the next step, which depends on the plot template
        if (isTmplSpc()) {
            loadSleep("loadInitXML_phaseFormat()");
        } else {
            loadSleep("loadInitXML_phaseIndy()");
        }
        return;
    }

    //  add and set the plot_fix div to set controls for
    if (isTmplSpc()) {
        addFixSpcVar();
        _divInitXMLPlotFix = _listFixSpcDiv[_listFixSpcDiv.length - 1];
    } else {
        if (TMPL_ENS_SS != _intTmpl) {
            addFixVar();
            _divInitXMLPlotFix = _listFixDiv[_listFixDiv.length - 1];
        } else {
            addFixSpcVar();
            _divInitXMLPlotFix = _listFixSpcDiv[_listFixSpcDiv.length - 1];
        }
    }


    //  load the stats for the next fcst_var
    debug("  divPlotFix = " + _divInitXMLPlotFix + "\n" +
            "  id = " + _divInitXMLPlotFix.id + "\n" +
            "  field = " + _listInitXMLPlotFix[0] + "\n" +
            "  select = " + _divInitXMLPlotFix.getElementsByTagName("select")[0] + "\n");
    setSelected(_divInitXMLPlotFix.getElementsByTagName("select")[0], _listInitXMLPlotFix[0].toUpperCase());
    if (isTmplSpc()) {
        selectFixSpcVarReq(getDivFieldValId(_divInitXMLPlotFix));
    } else {
        if (TMPL_ENS_SS != _intTmpl) {
            selectFixVarReq(getDivFieldValId(_divInitXMLPlotFix));
        } else {
            selectFixSpcVarReq(getDivFieldValId(_divInitXMLPlotFix));
        }
    }

    //  wait for the current fcst_var load to finish, then repeat
    debug("\n");
    loadSleep("loadInitXML_phasePlotFixLoad()");
}

/**
 * Parse the indy var and set the indy var select control to the appropriate
 * value. Then, list the indy var values and call the indy val handler.
 */
function loadInitXML_phaseIndy() {
    debug("loadInitXML_phaseIndy()\n");

    //  parse and set the indy var
    var strIndyVar = _strInitXML.match(/<indep name=\"(\w+)\">/)[1];
    debug("  var = " + strIndyVar + "\n");
    setSelected(document.getElementById("selIndyVar"), strIndyVar.toUpperCase());

    //  get the indy vals and call the indy val handler
    debug("\n");
    selectIndyVarReq();
    loadSleep("loadInitXML_phaseIndyLoad()");
}

/**
 * When the indy val list is loaded, parse the list of indy vals from the XML
 * and update the indy val list controls. Then, call the formatting handler.
 */
function loadInitXML_phaseIndyLoad() {
    debug("loadInitXML_phaseIndyLoad()\n");

    //  parse the list of indy values
    var strIndyVals = _strInitXML.match(/<indep[^>]+>(.*)<\/indep>/)[1];
    debug("  strIndyVals = " + strIndyVals + "\n  setting controls\n");
    indyCheck(false);

    //  for each indy val on the list, configure the indy val control
    while (0 < strIndyVals.length) {

        //  parse the components of the next indy val
        var listIndyVal = strIndyVals.match(/<val label="([\w\.\-: <>=]*)" plot_val="(\w*)">([\w\.\-: <>=]+)<\/val>(.*)/);
        //PGO var listIndyVal = strIndyVals.match( /<val label="([\w\.\-:<>=]*)" plot_val="(\w*)">([\w\.\-:<>=]+)<\/val>(.*)/ );
        strIndyVals = listIndyVal[4];

        //  find the corresponding indy val table row and set its controls
        debug("    val = " + listIndyVal[3] + "\n");
        var trVal = findIndyTr(listIndyVal[3]);
        trVal.getElementsByTagName("input")[0].checked = true;
        trVal.getElementsByTagName("input")[1].value = listIndyVal[1];
        trVal.getElementsByTagName("input")[2].value = listIndyVal[2];
    }

    debug("  controls complete\nloadInitXML_phaseIndyLoad() complete\n\n");
    loadInitXML_phaseFormat();
}

/**
 * The remaining web app functionality does not require AJAX calls, so it can be
 * performed in a single function. Parse and set the controls in the following
 * areas: - agg_stat - calc_stat - title_lab - plot_fmt - series_fmt - fmt_axis
 */
function loadInitXML_phaseFormat() {
    debug("loadInitXML_phaseFormat()\n");

    //  parse and set the agg_stat controls
    var listAggInput = document.getElementById("divAggStat").getElementsByTagName("input");
    if (null != _strInitXML.match(/<agg_stat>/)) {
        debug("  agg_stat\n");
        listAggInput[0].checked = true;
        var strAggCtc = _strInitXML.match(/<agg_ctc>(\w+)<\/agg_ctc>/)[1];
        listAggInput[1].checked = (strAggCtc == "TRUE");
        debug("    agg_ctc = " + strAggCtc + " -> " + (strAggCtc == "TRUE") + " - checked = " + listAggInput[1].checked + "\n");
        var strAggSl1l2 = _strInitXML.match(/<agg_sl1l2>(\w+)<\/agg_sl1l2>/)[1];
        listAggInput[2].checked = (strAggSl1l2 == "TRUE");
        debug("    agg_sl1l2 = " + strAggSl1l2 + " -> " + +(strAggSl1l2 == "TRUE") + " - checked = " + listAggInput[2].checked + "\n");
        var strAggPct = _strInitXML.match(/<agg_pct>(\w+)<\/agg_pct>/)[1];
        listAggInput[3].checked = (strAggPct == "TRUE");
        debug("    agg_pct = " + strAggPct + " -> " + (strAggPct == "TRUE") + " - checked = " + listAggInput[3].checked + "\n");
        var strAggNbrCnt = _strInitXML.match(/<agg_nbrcnt>(\w+)<\/agg_nbrcnt>/)[1];
        listAggInput[4].checked = (strAggNbrCnt == "TRUE");
        debug("    agg_nbrcnt = " + strAggNbrCnt + " -> " + (strAggNbrCnt == "TRUE") + " - checked = " + listAggInput[4].checked + "\n");
        listAggInput[5].value = _strInitXML.match(/<boot_repl>(\w+)<\/boot_repl>/)[1];
        //debug(" parsed value = " + _strInitXML.match( /<agg_diff1>(\w+)<\/agg_diff1>/ )[1] + " boolAggDiff1 = " + boolAggDiff1 + "\n");
        listAggInput[6].value = _strInitXML.match(/<boot_ci>(\w+)<\/boot_ci>/)[1];
        var strEveqDis = _strInitXML.match(/<eveq_dis>(\w+)<\/eveq_dis>/)[1];
        setSelected(document.getElementById("selEveqDis"), strEveqDis);
        if (_strInitXML.indexOf("cache_agg_stat") != -1) {
            var strCacheAggStat = _strInitXML.match(/<cache_agg_stat>(\w+)<\/cache_agg_stat>/)[1];
            document.getElementById('cacheAggStat').value = strCacheAggStat;
        }
    } else {
        listAggInput[0].checked = false;
    }
    updateAggStat();

    //  parse and set the calc_stat controls
    var listCalcInput = document.getElementById("divCalcStat").getElementsByTagName("input");
    if (null != _strInitXML.match(/<calc_stat>/)) {
        debug("  calc_stat\n");
        listCalcInput[0].checked = true;
        var strCalcCtc = _strInitXML.match(/<calc_ctc>(\w+)<\/calc_ctc>/)[1];
        listCalcInput[1].checked = (strCalcCtc == "TRUE");
        var strCalcSl1l2 = _strInitXML.match(/<calc_sl1l2>(\w+)<\/calc_sl1l2>/)[1];
        listCalcInput[2].checked = (strCalcSl1l2 == "TRUE");
    } else {
        listCalcInput[0].checked = false;
    }
    updateCalcStat();

    //  parse and set the normalized_histogram controls
    if (TMPL_RHIST == _intTmpl) {
        debug("  normalized_histogram\n");
        var strNormalizedHistogram = _strInitXML.match(/<normalized_histogram>(\w+)<\/normalized_histogram>/);
        if (strNormalizedHistogram) {
            strNormalizedHistogram = strNormalizedHistogram[1];
        } else {
            strNormalizedHistogram = "true";
        }
        $("input[name=normalized_histogram][value=" + strNormalizedHistogram + "]").prop('checked', true);

    }

    //  parse and set the roc_calc controls
    if (TMPL_ROC == _intTmpl) {
        debug("  roc_calc\n");
        var listRocCalcInput = document.getElementById("divRocCalc").getElementsByTagName("input");
        var strRocPct = _strInitXML.match(/<roc_pct>(\w+)<\/roc_pct>/)[1];
        listRocCalcInput[0].checked = (strRocPct == "TRUE");
        var strRocCtc = _strInitXML.match(/<roc_ctc>(\w+)<\/roc_ctc>/)[1];
        listRocCalcInput[1].checked = (strRocCtc == "TRUE");
    }

    //  parse and set the tmpl information
    var listTmplInput = document.getElementById("divTitleLab").getElementsByTagName("input");
    var listLab;
    debug("  title and labels\n");
    listTmplInput[0].value = ( null != (listLab = _strInitXML.match(/<title>(.+)<\/title>/)) ? listLab[1] : "" );
    listTmplInput[1].value = ( null != (listLab = _strInitXML.match(/<x_label>(.+)<\/x_label>/)) ? listLab[1] : "" );
    listTmplInput[2].value = ( null != (listLab = _strInitXML.match(/<y1_label>(.+)<\/y1_label>/)) ? listLab[1] : "" );
    listTmplInput[3].value = ( null != (listLab = _strInitXML.match(/<y2_label>(.+)<\/y2_label>/)) ? listLab[1] : "" );
    listTmplInput[4].value = ( null != (listLab = _strInitXML.match(/<caption>(.+)<\/caption>/)) ? listLab[1] : "" );

    //  plot formatting bool flags
    var tabFmtPlotBool = document.getElementById("tabFmtPlotBool");
    debug("  fmt_plot bool\n");
    for (var i = 0; i < tabFmtPlotBool.rows.length; i++) {
        for (var j = 0; j < tabFmtPlotBool.rows[i].cells.length; j++) {

            //  determine the name of the flag
            var listTdBool = tabFmtPlotBool.rows[i].cells[j].getElementsByTagName("td");
            if (1 > listTdBool.length) {
                continue;
            }
            var strBoolName = listTdBool[2].innerHTML;

            //  parse the flag value from the xml and set the control appropriately
            var regBool = new RegExp("<" + strBoolName + ">(\\w+)<\/" + strBoolName + ">");
            var selBool = tabFmtPlotBool.rows[i].cells[j].getElementsByTagName("select")[0];

            if (null != (listBoolVal = _strInitXML.match(regBool))) {
                setSelected(selBool, listBoolVal[1]);
            }
            else {
                debug("    WARNING: fmt_plot bool property " + strBoolName + " not found\n");
            }
        }
    }
    buildSeriesDiv();

    //add diff plots if exist
    var strListDiffSeries1 = _strInitXML.match(/<listDiffSeries1>(.*)<\/listDiffSeries1>/)[1];
    var strListDiffSeries2 = _strInitXML.match(/<listDiffSeries2>(.*)<\/listDiffSeries2>/)[1];
    loadInitXML_phaseDiffSeries(strListDiffSeries1, "1");
    loadInitXML_phaseDiffSeries(strListDiffSeries2, "2");
    document.getElementById("spanFmtSeriesNum").innerHTML = "# Series: " + _intNumSeries;

    //  plot formatting text values
    var tabFmtPlotTxt = document.getElementById("tabFmtPlotTxt");
    debug("  fmt_plot txt\n");
    for (var i = 0; i < tabFmtPlotTxt.rows.length; i++) {
        for (var j = 0; j < tabFmtPlotTxt.rows[i].cells.length; j++) {

            //  determine the name of the property
            var listTdTxt = tabFmtPlotTxt.rows[i].cells[j].getElementsByTagName("td");
            if (1 > listTdTxt.length) {
                continue;
            }
            var strTxtName = listTdTxt[2].innerHTML;
            debug("    txt property = " + strTxtName + " - ");

            //  parse the flag value from the xml and set the control appropriately
            var regTxt = new RegExp("<" + strTxtName + ">(.+)<\/" + strTxtName + ">");
            if (null != (listTxtVal = _strInitXML.match(regTxt))) {
                var inputTxtTxt = listTdTxt[1].getElementsByTagName("input")[0];
                var inputTxtSel = listTdTxt[1].getElementsByTagName("select")[0];
                if (inputTxtTxt.style.display != "none") {
                    debug("text box = " + inputTxtTxt + " value = " + listTxtVal[1] + "\n");
                    inputTxtTxt.value = listTxtVal[1];
                } else {
                    debug("select = " + inputTxtSel + " value = " + listTxtVal[1] + "\n");
                    setSelected(inputTxtSel, listTxtVal[1]);
                }
            } else {
                debug("WARNING: fmt_plot txt property " + strTxtName + " not found\n");
            }
        }
    }

    //  initialize the list of formatting values, depending on template
    var listParm = ["plot_ci", "colors", "pch", "type", "lty", "lwd", "con_series", "legend", "plot_disp", "order_series"];
    switch (_intTmpl) {
        case TMPL_RHIST:
            listParm = ["colors", "lwd", "legend"];
            break;
        case TMPL_ROC:
            listParm = ["colors", "pch", "type", "lty", "lwd"];
            break;
        case TMPL_RELY:
            listParm = ["colors", "pch", "type", "lty", "lwd"];
            break;
    }

    //  series formatting
    debug("  fmt_series txt\n");
    for (var i in listParm) {
        debug("    " + listParm[i]);

        //  parse the values for the current format setting
        var regFmt = new RegExp("<" + listParm[i] + ">c\\((.*)\\)<\/" + listParm[i] + ">");
        var listFmtVal;
        if (null == (listFmtVal = _strInitXML.match(regFmt))) {
            debug(" not found\n");
            continue;
        }

        //  loop through the list of formatting values and controls
        debug(" found - " + listFmtVal[1] + "\n");
        listFmtVal = listFmtVal[1].split(",");
        var intFmtRow = 0;
        for (var j in listFmtVal) {
            var listFmtTd = getFmtSeriesVal(intFmtRow);
            if (listFmtTd.length > 0) {

                //  strip leading spaces and quotes from the format value
                var strFmtVal = listFmtVal[j].replace(/^\s*\"?/, "").replace(/\"?\s*$/, "");
                debug("      " + strFmtVal + " - ");

                //  if the parameter is plot_disp, set the hide checkbox
                if (listParm[i] == "plot_disp") {
                    debug("hide chk\n");
                    setFmtSeriesHide(intFmtRow, (strFmtVal == "FALSE"));
                    intFmtRow += 2;
                    continue;
                }
                if (listParm[i] == "order_series") {
                    var tabFmtSeries = document.getElementById("tabFmtSeries");
                    var trFmtSeries = tabFmtSeries.rows[intFmtRow];

                    trFmtSeries.cells[0].getElementsByTagName("input")[2].value = strFmtVal;
                    intFmtRow += 2;
                    continue;
                }

                //  locate the format control in the series format list and set it
                var listFmtTdParm = listFmtTd[i].getElementsByTagName("td");
                var listFmtTxt = listFmtTdParm[1].getElementsByTagName("input");
                var listFmtSel = listFmtTdParm[1].getElementsByTagName("select");
                if (null != listFmtTxt && 0 < listFmtTxt.length) {
                    debug("text\n");
                    listFmtTxt[0].value = strFmtVal;
                } else if (null != listFmtSel && 0 < listFmtSel.length) {
                    debug("select\n");
                    setSelected(listFmtSel[0], strFmtVal);
                } else {
                    debug("WARNING: series format control not found\n");
                }

                //  if setting the first parameter (plot_ci), set the series formatting section to modified
                if (0 == i && !isTmplSpc()) {
                    setFmtSeriesMod(j, true);
                }
                intFmtRow += 2;
            }
        }


    }

    //  axis formatting
    var listFmtAxisInput = document.getElementById("divFmtAxis").getElementsByTagName("input");
    var listFmtAxis;
    debug("  axis formatting\n");
    listFmtAxisInput[0].value = ( null != (listFmtAxis = _strInitXML.match(/<y1_lim>(.+)<\/y1_lim>/)) ? listFmtAxis[1] : "" );
    listFmtAxisInput[1].value = ( null != (listFmtAxis = _strInitXML.match(/<y1_bufr>(.+)<\/y1_bufr>/)) ? listFmtAxis[1] : "" );
    listFmtAxisInput[2].value = ( null != (listFmtAxis = _strInitXML.match(/<y2_lim>(.+)<\/y2_lim>/)) ? listFmtAxis[1] : "" );
    listFmtAxisInput[3].value = ( null != (listFmtAxis = _strInitXML.match(/<y2_bufr>(.+)<\/y2_bufr>/)) ? listFmtAxis[1] : "" );


    //  turn off the dimmer
    debug("  max checks: " + _intInitXMLChecksMax + "\nloadInitXML_phaseFormat() complete\n\n");
    _boolDimOverride = false;
    dimScreen(false);
    _boolInitXML = false;
}

function loadInitXML_phaseDiffSeries(strListDiffSeries, ySeries) {
    var tabFmtSeries = document.getElementById("tabFmtSeries");
    if (strListDiffSeries != "list()") {
        //list(c("EnKF,GSI3 TMP BCMSE","GSI3,WRF TMP BCMSE"))
        strListDiffSeries = strListDiffSeries.substring(5, strListDiffSeries.length - 1);
        //c("EnKF,GSI3 TMP BCMSE","GSI3,WRF TMP BCMSE")"
        var diffSeries = strListDiffSeries.split("c(");
        for (var i = 1; i < diffSeries.length; i++) {
            //"EnKF,GSI3 TMP BCMSE","GSI3,WRF TMP BCMSE")
            diffSeries[i] = diffSeries[i].replace(/"/g, '');
            var listSeriesDiv;
            if(ySeries == 1){
                listSeriesDiv = _listSeries1Div;
            }else{
                listSeriesDiv = _listSeries2Div;
            }

            for(var k=0; k < listSeriesDiv.length; k++){
                var id="Group_" +listSeriesDiv[k].id.split("divFieldVal")[1];
                if(group_name_to_value_map[id] != null){
                    var val = group_name_to_value_map[id].join();
                    diffSeries[i] = diffSeries[i].replace(val, id);
                }
            }
            var strSeriesName = "DIFF (" + diffSeries[i].replace(/,/g, '-');
            if (ySeries == 1) {
                seriesDiffY1.push(diffSeries[i].substring(0, diffSeries[i].length - 1).replace(",", "--"));
            } else {
                seriesDiffY2.push(diffSeries[i].substring(0, diffSeries[i].length - 1));
            }
            var trFmtSeries;
            var tdName;
            //  insert the <hr/> between series format controls
            if (1 == _intNumSeries) {
                tabFmtSeries.rows[1].style.display = "table-row";
            }
            else {
                var trHR = tabFmtSeries.insertRow(tabFmtSeries.rows.length);
                var tdHR = trHR.insertCell(0);
                tdHR.colSpan = "3";
                tdHR.appendChild(document.getElementById("spanFmtSeriesHR").cloneNode(true));
            }

            //  insert a copy of the series format controls
            trFmtSeries = tabFmtSeries.insertRow(tabFmtSeries.rows.length);

            var tdName = trFmtSeries.insertCell(0);
            tdName.align = "right";
            tdName.style.width = "350px";
            tdName.style.paddingTop = "20px";
            tdName.appendChild(document.getElementById("spanFmtSeriesName").cloneNode(true));

            var tdFmt1 = trFmtSeries.insertCell(1);
            tdFmt1.align = "right";
            tdFmt1.style.width = "200px";
            tdFmt1.style.paddingTop = "20px";
            tdFmt1.appendChild(document.getElementById("tabFmtSeriesVal1").cloneNode(true));
            tdFmt1.getElementsByTagName("input")[1].value = "";

            var tdFmt2 = trFmtSeries.insertCell(2);
            tdFmt2.align = "right";
            tdFmt2.style.width = "275px";
            tdFmt2.style.paddingTop = "20px";
            tdFmt2.appendChild(document.getElementById("tabFmtSeriesVal2").cloneNode(true));


            //  populate the controls with the series name
            var strYSeries = "Y" + ySeries + "Series";
            tdName.getElementsByTagName("span")[1].innerHTML = "<button onclick='deleteDiffSeries(this, \"" + diffSeries[i].substring(0, diffSeries[i].length - 1) + "\", " + ySeries + ");'>Delete</button>";
            tdName.getElementsByTagName("span")[2].innerHTML = strSeriesName;
            tdName.getElementsByTagName("span")[3].innerHTML = strYSeries;

            //  add change handlers to the formatting inputs
            var listInput = trFmtSeries.getElementsByTagName("input");
            listInput[1].setAttribute("onclick", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
            if (_boolIE) {
                listInput[1].attachEvent("onclick", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
            }

            listInput[2].setAttribute("onclick", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
            if (_boolIE) {
                listInput[2].attachEvent("onclick", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
            }
            listInput[2].value = _intNumSeries + 1;
            for (var i = 3; i < listInput.length; i++) {
                listInput[i].setAttribute("onkeydown", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
                if (_boolIE) {
                    listInput[i].attachEvent("onkeydown", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
                }
            }
            var listSel = trFmtSeries.getElementsByTagName("select");
            for (var i = 0; i < listSel.length; i++) {
                listSel[i].setAttribute("onchange", "javascript:setFmtSeriesMod(" + _intNumSeries + ", 'true')");
                if (_boolIE) {
                    listSel[i].attachEvent("onchange", new Function("setFmtSeriesMod(" + _intNumSeries + ", 'true')"));
                }
            }
            _intNumSeries++;

        }
    }
}

function deleteDiffSeries(el, seriesDiffName, ySeries) {
    if (ySeries == 1) {
        var index = seriesDiffY1.indexOf(seriesDiffName);
        if (index > -1) {
            seriesDiffY1.splice(index, 1);
        }
    } else {
        var index = seriesDiffY2.indexOf(seriesDiffName);
        if (index > -1) {
            seriesDiffY2.splice(index, 1);
        }
    }
    var parentTR = findUpTag(el, "tr");
    var siblingParentTR = parentTR.previousSibling;
    parentTR.parentNode.removeChild(parentTR);
    siblingParentTR.parentNode.removeChild(siblingParentTR);
    _intNumSeries--;
    document.getElementById("spanFmtSeriesNum").innerHTML = "# Series: " + _intNumSeries;
}
function findUpTag(el, tag) {
    while (el.parentNode) {
        el = el.parentNode;
        if (el.tagName === tag || el.tagName == tag.toUpperCase())
            return el;
    }
    return null;
}





