/**
 * DatabaseManager.java Copyright UCAR (c) 2017. University Corporation for Atmospheric Research (UCAR), National Center for Atmospheric Research (NCAR),
 * Research Applications Laboratory (RAL), P.O. Box 3000, Boulder, Colorado, 80307-3000, USA.Copyright UCAR (c) 2017.
 */

package edu.ucar.metviewer.test;

import edu.ucar.metviewer.db.DatabaseInfo;
import org.apache.logging.log4j.io.IoBuilder;
import edu.ucar.metviewer.db.DatabaseManager;

import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * @author : tatiana $
 * @version : 1.0 : 19/05/17 12:42 $
 */
public class TestDatabaseManager {
    public static TestDBManager getManager(String management_system, String host, String user, String password, String dbName) throws Exception {
        String ms = management_system.toLowerCase();
        String dbType = (ms == null || ms == "") ? "mysql" : ms; // default dbType to mysql if management_system is missing
        DatabaseInfo databaseInfo = new DatabaseInfo(host, user, password);
        databaseInfo.setDbName(dbName);
        TestDBManager databaseManager = null;
        switch (dbType) {
            case "mysql":
                databaseManager = new TestMysqlDatabaseManager(databaseInfo);
                break;
            case "cb":
                databaseManager = new TestCBDatabaseManager(databaseInfo);
                break;
            default:
                throw new IllegalArgumentException("Invalid database type: " + dbType);
        }
        return databaseManager;
    }
}
