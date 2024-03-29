export const foxx_manifest = {
    "$schema": "http://json-schema.org/draft-04/schema",
    "description": "Schema for ArangoDB Foxx service manifests",
    "title": "ArangoDB Foxx Service",
    "type": "object",

    "properties": {
        "configuration": {
            "type": "object",
            "description": "An object defining the configuration options this service requires.",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "description": {
                        "type": "string",
                        "description": "A human-readable description of the option."
                    },
                    "type": {
                        "type": "string",
                        "description": "The type of value expected for this option.",
                        "enum": [
                            "integer",
                            "boolean",
                            "number",
                            "string",
                            "json",
                            "password",
                            "int",
                            "bool"
                        ],
                        "default": "string"
                    },
                    "default": {
                        "description": "The default value for this option in plain JSON. Can be omitted to provide no default value."
                    },
                    "required": {
                        "type": "boolean",
                        "description": "Whether the service can not function without this option. Defaults to true unless a default value is provided.",
                        "default": true
                    }
                },
                "required": ["type"]
            }
        },
        "defaultDocument": {
            "type": "string",
            "description": "If specified, the / (root) route of the service will automatically redirect to the given relative path, e.g. \"index.html\"."
        },
        "dependencies": {
            "type": "object",
            "description": "The dependencies this service uses, i.e. which APIs its dependencies need to be compatible with.",
            "additionalProperties": {
                "oneOf": [
                    {
                        "type": "string",
                        "description":
                            "The semantic version ranges of the API the service expects.",
                        "default": "*"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "Name of the API the service expects.",
                                "default": "*"
                            },
                            "version": {
                                "type": "string",
                                "description":
                                    "The semantic version ranges of the API the service expects.",
                                "default": "*"
                            },
                            "description": {
                                "type": "string",
                                "description":
                                    "A description of how the API is used or why it is needed."
                            },
                            "required": {
                                "type": "boolean",
                                "description":
                                    "Whether the service can not function without this dependency.",
                                "default": true
                            },
                            "multiple": {
                                "type": "boolean",
                                "description":
                                    "Whether the dependency can be specified more than once.",
                                "default": false
                            }
                        }
                    }
                ]
            }
        },
        "provides": {
            "type": "object",
            "description":
                "The dependencies this provides, i.e. which APIs it claims to be compatible with.",
            "additionalProperties": {
                "type": "string",
                "description":
                    "The semantic version ranges of the API the service implements.",
                "default": "*"
            }
        },
        "engines": {
            "type": "object",
            "description":
                "An object indicating the semantic version ranges of ArangoDB (or compatible environments) the service will be compatible with.",
            "properties": {
                "arangodb": {
                    "type": "string",
                    "default": "^3.0.0"
                }
            },
            "additionalProperties": {"type": "string"}
        },
        "files": {
            "type": "object",
            "description": "An object defining file assets served by this service.",
            "additionalProperties": {
                "oneOf": [
                    {
                        "type": "string",
                        "description":
                            "Relative path of the file or folder within the service."
                    },
                    {
                        "type": "object",
                        "properties": {
                            "path": {
                                "type": "string",
                                "description":
                                    "Relative path of the file or folder within the service."
                            },
                            "gzip": {
                                "type": "boolean",
                                "description":
                                    "If set to true the file will be served with gzip-encoding if supported by the client. This can be useful when serving text files like client-side JavaScript, CSS or HTML.",
                                "default": false
                            },
                            "type": {
                                "type": "string",
                                "description":
                                    "The MIME content type of the file. Defaults to an intelligent guess based on the filename's extension."
                            }
                        },
                        "required": ["path"]
                    }
                ]
            }
        },
        "lib": {
            "type": "string",
            "description":
                "The relative path to the Foxx JavaScript files in the service, e.g. \"lib\". Defaults to the folder containing this manifest.",
            "default": "."
        },
        "main": {
            "type": "string",
            "description":
                "The relative path to the main entry point of this service (relative to lib), e.g. \"index.js\".",
            "default": "index.js"
        },
        "scripts": {
            "type": "object",
            "description":
                "An object defining named scripts provided by this service, which can either be used directly or as queued jobs by other services.",
            "additionalProperties": {
                "type": "string",
                "description":
                    "Path of the script (relative to lib), e.g. \"scripts/setup.js\"."
            }
        },
        "tests": {
            "description":
                "A path/pattern or list of paths/patterns of JavaScript tests provided for this service.",
            "oneOf": [
                {"type": "string"},
                {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description":
                            "A single path/pattern of JavaScript tests provided for this service."
                    }
                }
            ],
            "default": "test/**/*.js"
        },
        "author": {
            "type": "string",
            "description":
                "The full name of the author of the service (i.e. you). This will be shown in the web interface."
        },
        "contributors": {
            "type": "array",
            "description":
                "A list of names of people that have contributed to the development of the service in some way. This will be shown in the web interface.",
            "items": {
                "type": "string",
                "description":
                    "Human-readable representation of the contributor, e.g. their name."
            }
        },
        "description": {
            "type": "string",
            "description":
                "A human-readable description of the service. This will be shown in the web interface."
        },
        "keywords": {
            "type": "array",
            "description":
                "A list of keywords that help categorize this service. This is used by the Foxx Store installers to organize services.",
            "items": {
                "type": "string",
                "description": "A keyword relevant to the service."
            }
        },
        "license": {
            "type": "string",
            "description":
                "A string identifying the license under which the service is published, ideally in the form of an SPDX license identifier. This will be shown in the web interface."
        },
        "name": {
            "type": "string",
            "description":
                "The name of the Foxx service. This will be shown in the web interface."
        },
        "thumbnail": {
            "type": "string",
            "description":
                "The filename of a thumbnail that will be used alongside the service in the web interface. This should be a JPEG or PNG image that looks good at sizes 50x50 and 160x160."
        },
        "version": {
            "type": "string",
            "description":
                "The version number of the Foxx service. The version number must follow the semantic versioning format. This will be shown in the web interface."
        }
    }
};

export const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": "Book",
    "properties": {
        "id": {"type": "string"},
        "title": {"type": "string"},
        "author": {"type": "string"},
        "year": {"type": "integer"},
        "publisher": {"type": "string"},
        "website": {"type": "string"},
        "doc": {
            "type": "object",
            "properties": {
                "serial_number": {"type": "string"},
                "logs_2": {"type": "string"},
                "sub_doc_internal": {
                    "type": "object",
                    "properties": {
                        "ean": {
                            "type": "integer"
                        },
                        "sn": {
                            "type": "string"
                        },
                        "pm": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "ean"
                    ]
                },
                "sub_doc_a": {
                    "type": "object",
                    "properties": {
                        "b": {
                            "type": "object",
                            "properties": {
                                "c": {
                                    "type": "object",
                                    "properties": {
                                        "d": {
                                            "type": "object",
                                            "properties": {
                                                "e": {
                                                    "type": "object",
                                                    "properties": {
                                                        "f": {
                                                            "type": "object",
                                                            "properties": {
                                                                "id_0123456789": {
                                                                    "type": "integer"
                                                                }
                                                            },
                                                            "required": [
                                                                "id"
                                                            ]
                                                        }
                                                    },
                                                    "required": [
                                                        "f"
                                                    ]
                                                }
                                            },
                                            "required": [
                                                "e"
                                            ]
                                        }
                                    },
                                    "required": [
                                        "d"
                                    ]
                                }
                            },
                            "required": [
                                "c"
                            ]
                        }
                    },
                    "required": [
                        "b"
                    ]
                }
            },
            "required": [
                "internal"
            ]
        },
        "arr": {
            "type": "array",
            "items": [
                {
                    "type": "boolean"
                },
                {
                    "type": "integer"
                },
                {
                    "type": "string"
                },
                {
                    "type": "object",
                    "properties": {
                        "ean": {
                            "type": "integer"
                        },
                        "sn": {
                            "type": "string"
                        },
                        "pm": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "ean"
                    ]
                }
            ]
        },
    },
    "required": ["id", "title", "author", "year", "publisher", "subDoc"]
};

export const complexSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "billing_address": {"$ref": "#/definitions/address"},
        "shipping_address": {"$ref": "#/definitions/address"}
    },
    "definitions": {
        "address": {
            "type": "object",
            "properties": {
                "street_address": {"type": "string"},
                "city": {"type": "string"},
                "state": {"type": "string"}
            },
            "required": ["street_address", "city", "state"]
        }
    },
};

export const multiLevel = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {},
    "required": [
        "a"
    ]
};

export const simulations = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "SIMULATIONS",
    "type": "object",
    "properties": {
        "_id": {
            "type": "string"
        },
        "createdOn": {
            "type": "string"
        },
        "fileName": {
            "type": "string"
        },
        "migCastConfigurationList": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "_id": {
                        "type": "string"
                    },
                    "createdOn": {
                        "type": "string"
                    },
                    "migCastParameters": {
                        "type": "object",
                        "properties": {
                            "adaptiveFlag": {
                                "type": "boolean"
                            },
                            "cloudPrice": {
                                "type": "number"
                            },
                            "complexity": {
                                "type": "integer"
                            },
                            "dataGrowthRate": {
                                "type": "integer"
                            },
                            "eagerFlag": {
                                "type": "boolean"
                            },
                            "incrementalFlag": {
                                "type": "boolean"
                            },
                            "incrementalRound": {
                                "type": "integer"
                            },
                            "initialNumber": {
                                "type": "integer"
                            },
                            "lazyFlag": {
                                "type": "boolean"
                            },
                            "location": {
                                "type": "string"
                            },
                            "migrationType": {
                                "type": "string"
                            },
                            "mission2playerCardinality": {
                                "type": "integer"
                            },
                            "operationExecution": {
                                "type": "string"
                            },
                            "pattern": {
                                "type": "string"
                            },
                            "percentageAccessedData": {
                                "type": "integer"
                            },
                            "place2missionCardinality": {
                                "type": "integer"
                            },
                            "predictionCacheSize": {
                                "type": "integer"
                            },
                            "predictionSetSize": {
                                "type": "integer"
                            },
                            "predictiveFlag": {
                                "type": "boolean"
                            },
                            "realInitialNumber": {
                                "type": "integer"
                            },
                            "schemaChanges4Adaptive": {
                                "type": "integer"
                            },
                            "schemaModifications": {
                                "type": "integer"
                            },
                            "simpleLRUFlag": {
                                "type": "boolean"
                            },
                            "superPredictionSetEscalation": {
                                "type": "integer"
                            },
                            "useCacheFlag": {
                                "type": "boolean"
                            },
                            "workloadExecutions": {
                                "type": "integer"
                            }
                        },
                        "required": [
                            "adaptiveFlag",
                            "cloudPrice",
                            "complexity",
                            "dataGrowthRate",
                            "eagerFlag",
                            "incrementalFlag",
                            "incrementalRound",
                            "initialNumber",
                            "lazyFlag",
                            "location",
                            "migrationType",
                            "mission2playerCardinality",
                            "operationExecution",
                            "pattern",
                            "percentageAccessedData",
                            "place2missionCardinality",
                            "predictionCacheSize",
                            "predictionSetSize",
                            "predictiveFlag",
                            "realInitialNumber",
                            "schemaChanges4Adaptive",
                            "schemaModifications",
                            "simpleLRUFlag",
                            "superPredictionSetEscalation",
                            "useCacheFlag",
                            "workloadExecutions"
                        ]
                    }
                },
                "required": [
                    "_id",
                    "createdOn",
                    "migCastParameters"
                ]
            }

        }
    },
    "required": [
        "_id",
        "createdOn",
        "fileName",
        "migCastConfigurationList"
    ]
};

export const migCastDbSchemata = {
    simulations: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "SIMULATIONS",
        "type": "object",
        "properties": {
            "_id": {
                "type": "string"
            },
            "createdOn": {
                "type": "string"
            },
            "fileName": {
                "type": "string"
            },
            "migCastConfigurationList": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "_id": {
                            "type": "string"
                        },
                        "createdOn": {
                            "type": "string"
                        },
                        "migCastParameters": {
                            "type": "object",
                            "properties": {
                                "adaptiveFlag": {
                                    "type": "boolean"
                                },
                                "cloudPrice": {
                                    "type": "number"
                                },
                                "complexity": {
                                    "type": "integer"
                                },
                                "dataGrowthRate": {
                                    "type": "integer"
                                },
                                "eagerFlag": {
                                    "type": "boolean"
                                },
                                "incrementalFlag": {
                                    "type": "boolean"
                                },
                                "incrementalRound": {
                                    "type": "integer"
                                },
                                "initialNumber": {
                                    "type": "integer"
                                },
                                "lazyFlag": {
                                    "type": "boolean"
                                },
                                "location": {
                                    "type": "string"
                                },
                                "migrationType": {
                                    "type": "string"
                                },
                                "mission2playerCardinality": {
                                    "type": "integer"
                                },
                                "operationExecution": {
                                    "type": "string"
                                },
                                "pattern": {
                                    "type": "string"
                                },
                                "percentageAccessedData": {
                                    "type": "integer"
                                },
                                "place2missionCardinality": {
                                    "type": "integer"
                                },
                                "predictionCacheSize": {
                                    "type": "integer"
                                },
                                "predictionSetSize": {
                                    "type": "integer"
                                },
                                "predictiveFlag": {
                                    "type": "boolean"
                                },
                                "realInitialNumber": {
                                    "type": "integer"
                                },
                                "schemaChanges4Adaptive": {
                                    "type": "integer"
                                },
                                "schemaModifications": {
                                    "type": "integer"
                                },
                                "simpleLRUFlag": {
                                    "type": "boolean"
                                },
                                "superPredictionSetEscalation": {
                                    "type": "integer"
                                },
                                "useCacheFlag": {
                                    "type": "boolean"
                                },
                                "workloadExecutions": {
                                    "type": "integer"
                                }
                            },
                            "required": [
                                "adaptiveFlag",
                                "cloudPrice",
                                "complexity",
                                "dataGrowthRate",
                                "eagerFlag",
                                "incrementalFlag",
                                "incrementalRound",
                                "initialNumber",
                                "lazyFlag",
                                "location",
                                "migrationType",
                                "mission2playerCardinality",
                                "operationExecution",
                                "pattern",
                                "percentageAccessedData",
                                "place2missionCardinality",
                                "predictionCacheSize",
                                "predictionSetSize",
                                "predictiveFlag",
                                "realInitialNumber",
                                "schemaChanges4Adaptive",
                                "schemaModifications",
                                "simpleLRUFlag",
                                "superPredictionSetEscalation",
                                "useCacheFlag",
                                "workloadExecutions"
                            ]
                        }
                    },
                    "required": [
                        "_id",
                        "createdOn",
                        "migCastParameters"
                    ]
                }

            }
        },
        "required": [
            "_id",
            "createdOn",
            "fileName",
            "migCastConfigurationList"
        ]
    },
    results: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "_id": {
                "type": "string"
            },
            "configId": {
                "type": "string"
            },
            "f1Score": {
                "type": "number"
            },
            "f1ScoreAdaptive": {
                "type": "number"
            },
            "latencyPeriodCumulated": {
                "type": "object",
                "properties": {
                    "adaptive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "eager": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "lazy": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "predictive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "incremental": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    }
                }
            },
            "migCastLogs": {
                "type": "string"
            },
            "migrationCostsCumulated": {
                "type": "object",
                "properties": {
                    "adaptive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "eager": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "lazy": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "predictive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "incremental": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    }
                }
            },
            "migrationCostsOnRead": {
                "type": "object",
                "properties": {
                    "adaptive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "eager": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "lazy": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "predictive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "incremental": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    }
                }
            },
            "migrationCostsOnRelease": {
                "type": "object",
                "properties": {
                    "adaptive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "eager": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "lazy": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "predictive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "incremental": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    }
                }
            },
            "migrationDebtCumulated": {
                "type": "object",
                "properties": {
                    "adaptive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "eager": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "lazy": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "predictive": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    },
                    "incremental": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    }
                }
            },
            "precision": {
                "type": "number"
            },
            "precisionAdaptive": {
                "type": "number"
            },
            "recall": {
                "type": "number"
            },
            "recallAdaptive": {
                "type": "number"
            }
        },
        "title": "RESULTS"
    },
    stats: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "_id": {
                "type": "string"
            },
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "adaptive": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "release": {
                                        "type": "number"
                                    },
                                    "min": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "first_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "median": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "mean": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "third_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "max": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "upper_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {}
                                            }
                                        }
                                    },
                                    "upper_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    }
                                },
                                "required": [
                                    "release",
                                    "min",
                                    "first_quartile",
                                    "median",
                                    "mean",
                                    "third_quartile",
                                    "max",
                                    "lower_fence",
                                    "upper_fence",
                                    "lower_outliers",
                                    "upper_outliers"
                                ]
                            }
                        },
                        "eager": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "release": {
                                        "type": "number"
                                    },
                                    "min": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "first_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "median": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "mean": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "third_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "max": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "upper_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {}
                                            }
                                        }
                                    },
                                    "upper_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {}
                                            }
                                        }
                                    }
                                },
                                "required": [
                                    "release",
                                    "min",
                                    "first_quartile",
                                    "median",
                                    "mean",
                                    "third_quartile",
                                    "max",
                                    "lower_fence",
                                    "upper_fence",
                                    "lower_outliers",
                                    "upper_outliers"
                                ]
                            }
                        },
                        "lazy": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "release": {
                                        "type": "number"
                                    },
                                    "min": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "first_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "median": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "mean": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "third_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "max": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "upper_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {}
                                            }
                                        }
                                    },
                                    "upper_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    }
                                },
                                "required": [
                                    "release",
                                    "min",
                                    "first_quartile",
                                    "median",
                                    "mean",
                                    "third_quartile",
                                    "max",
                                    "lower_fence",
                                    "upper_fence",
                                    "lower_outliers",
                                    "upper_outliers"
                                ]
                            }
                        },
                        "predictive": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "release": {
                                        "type": "number"
                                    },
                                    "min": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "first_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "median": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "mean": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "third_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "max": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "upper_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {}
                                            }
                                        }
                                    },
                                    "upper_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    }
                                },
                                "required": [
                                    "release",
                                    "min",
                                    "first_quartile",
                                    "median",
                                    "mean",
                                    "third_quartile",
                                    "max",
                                    "lower_fence",
                                    "upper_fence",
                                    "lower_outliers",
                                    "upper_outliers"
                                ]
                            }
                        },
                        "incremental": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "release": {
                                        "type": "number"
                                    },
                                    "min": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "first_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "median": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "mean": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "third_quartile": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "max": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "upper_fence": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "number"
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "number"
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "number"
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "lower_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {}
                                            }
                                        }
                                    },
                                    "upper_outliers": {
                                        "type": "object",
                                        "properties": {
                                            "migrationCostsCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRelease": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationCostsOnRead": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "latencyPeriodCumulated": {
                                                "type": "array",
                                                "items": {}
                                            },
                                            "migrationDebtCumulated": {
                                                "type": "array",
                                                "items": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    }
                                },
                                "required": [
                                    "release",
                                    "min",
                                    "first_quartile",
                                    "median",
                                    "mean",
                                    "third_quartile",
                                    "max",
                                    "lower_fence",
                                    "upper_fence",
                                    "lower_outliers",
                                    "upper_outliers"
                                ]
                            }
                        }
                    }
                }
            },
            "simulationFileName": {
                "type": "string"
            },
            "simulationId": {
                "type": "string"
            }
        },
        "title": "STATS"
    }
};

export const speciesDbSchemata = {
    species: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "id": {
                "type": "number"
            },
            "name": {
                "type": "string"
            },
            "ts": {
                "type": "number"
            },
            "worms": {
                "type": "string"
            }
        },
        "title": "SPECIES"
    },
    protocols: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "id": {
                "type": "number"
            },
            "timemarker": {
                "type": "string"
            },
            "location": {
                "type": "string"
            },
            "spec_id": {
                "type": "number"
            },
            "ts": {
                "type": "number"
            }
        },
        "title": "PROTOCOLS"
    }
};

export const movieLensDbSchemata = {
    users: {
        "properties": {
            "id": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "email": {
                "type": "string"
            },
            "address": {
                "type": "object",
                "properties": {
                    "street": {
                        "type": "string"
                    },
                    "city": {
                        "type": "string"
                    }
                }
            },
            "isOnline": {
                "type": "boolean"
            },
            "ssn": {
                "type": "integer"
            }
        },
        "title": "USERS"
    },
    links: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "movie_id": {
                "type": "string"
            },
            "imdb_id": {
                "type": "string"
            },
            "tmdb_id": {
                "type": "string"
            }
        },
        "title": "LINKS"
    },
    movies: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "title": {
                "type": "string"
            },
            "genres": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "title": "MOVIES"
    },
    ratings: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "user_id": {
                "type": "string"
            },
            "movie_id": {
                "type": "string"
            },
            "rating": {
                "type": "number"
            },
            "timestamp": {
                "type": "number"
            }
        },
        "title": "RATINGS"
    },
    tags: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "user_id": {
                "type": "string"
            },
            "movie_id": {
                "type": "string"
            },
            "tag": {
                "type": "string"
            },
            "timestamp": {
                "type": "number"
            }
        },
        "title": "TAGS"
    }
};

export const schema2 = {
    "$id": "http://example.com/example.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "definitions": {},
    "description": "root of schema",
    "properties": {
        "id": {
            "$id": "/properties/id",
            "type": "string",
            "title": "The id Schema ",
            "default": "",
            "examples": [
                "asdasdas"
            ]
        },
        "num": {
            "$id": "/properties/num",
            "type": "integer",
            "title": "The num Schema ",
            "default": 0,
            "examples": [
                123
            ]
        },
        "bool": {
            "$id": "/properties/bool",
            "type": "boolean",
            "title": "The bool Schema ",
            "default": false,
            "examples": [
                true
            ]
        },
        "arr": {
            "type": "array",
            "items": [
                {
                    "type": "boolean"
                },
                {
                    "type": "integer"
                },
                {
                    "type": "string",
                },
                {
                    "type": "object",
                    "properties": {
                        "ean": {
                            "type": "integer"
                        },
                        "sn": {
                            "type": "string"
                        },
                        "pm": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "ean"
                    ]
                }
            ]
        },
        "obj": {
            "type": "object",
            "properties": {
                "sub": {
                    "type": "integer"
                }
            },
            "required": [
                "sub"
            ]
        }
    },
    "required": [
        "id",
        "num",
        "bool",
        "arr",
        "obj"
    ]
};
