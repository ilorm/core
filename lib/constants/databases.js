'use strict';

/**
 * Generic constants using to define compatibility between database
 */

module.exports = {
  FAMILY: {
    SQL: Symbol('SQL'),
    NO_SQL_DOCUMENTS: Symbol('NoSQLDocuments'),
  },
  LIST: {
    APACHE_HIVE: 'Apache Hive',
    COUCHBASE: 'CouchBase',
    COUCHDB: 'CouchDB',
    DB2: 'DB2',
    DYNAMODB: 'DynamoDB',
    FILEMAKER: 'FileMaker',
    FIREBASE: 'Firebase',
    FIREBIRD: 'Firebird',
    INFORMIX: 'Informix',
    INGRES: 'Ingres',
    MARIADB: 'MariaDB',
    MONGODB: 'MongoDB',
    MYSQL: 'MySQL',
    NEO4J: 'Neo4j',
    NETEZZA: 'Netezza',
    ORACLE: 'Oracle',
    POSTGRESQL: 'PostgreSQL',
    REDIS: 'Redis',
    RIAK: 'Riak',
    SAP_HANA: 'SAP HANA',
    SQL_SERVER: 'SQL Server',
    SQLITE: 'SQLite',
    SOLR: 'Solr',
    SPLUNK: 'Splunk',
    SYBASE: 'Sybase',
    TERADATA: 'Teradata',
    DBASE: 'dBase',
    ELASTICSEARCH: 'elasticsearch',
    HBASE: 'hbase',
    MEMCACHED: 'memcached',
  },
  MONGODB: {},
};

