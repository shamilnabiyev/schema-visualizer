export const jsonDocValidator = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "anyOf": [
        {"$ref": "#/definitions/object_typ"},
        {"$ref": "#/definitions/array_type"}
    ],
    "definitions": {
        "object_typ": {
            "type": "object",
            "minProperties": 1
        },
        "array_type": {
            "type": "array",
            "items": {"$ref": "#/definitions/object_typ"},
            "minItems": 1,
        }
    }
};

export const jsonSchemaValidator = {
    "title": "JSON-Schema-Validator",
    "description": "Validates the JSON-Schema",
    "type": "object",
    "properties": {
        "title": {
            "type": "string"
        },
        "properties": {
            "type": "object",
            "properties": {
                "subtype": {
                    "type": "object",
                    "properties": {
                        "supertype_name": {"type": "string"}
                    }
                },
                "supertype": {
                    "type": "object",
                    "properties": {
                        "subtype_names": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    }
                }
            },
            "minProperties": 1,
            "additionalProperties": {
                "anyOf": [
                    {"$ref": "#/definitions/simple_types"},
                    {"$ref": "#/definitions/array_type"},
                    {"$ref": "#/definitions/object_type"},
                    {
                        "type": "object",
                        "properties": {
                            "anyOf": {
                                "type": "array",
                                "items": {
                                    "anyOf": [
                                        {"$ref": "#/definitions/simple_types"},
                                        {"$ref": "#/definitions/array_type"},
                                        {"$ref": "#/definitions/object_type"}
                                    ]
                                }
                            }
                        },
                        "required": ["anyOf"]
                    }
                ]
            }
        }
    },
    "required": ["properties"],
    "definitions": {
        "simple_types": {
            "type": "object",
            "description": "Validiert primitive Datentypen, wie string, number und boolean",
            "properties": {
                "type": {"type": "string"},
                "constraints": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": ["req", "opt", "ID", "REF", "unq", "rcv", "idx"]
                    }
                }
            },
            "required": ["type" /*, "constraints" */],
            "additionalProperties": false
        },
        "array_type": {
            "type": "object",
            "properties": {
                "type": {"type": "string"},
                "items": {
                    "anyOf": [
                        {"$ref": "#/definitions/simple_types"},
                        /* {
                            "type": "object",
                            "properties": {
                                "anyOf": {
                                    "type": "array",
                                    "items": {
                                        "anyOf": [
                                            {"$ref": "#/definitions/simple_types_secondary"},
                                            {"$ref": "#/definitions/object_type"}
                                        ]
                                    }
                                }
                            },
                            "required": ["anyOf"]
                        } */
                    ]
                },
                "constraints": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": ["req", "opt", "REF", "unq", "rcv", "idx"]
                    }
                }
            },
            "required": ["type", "items" /* , "constraints" */],
            "additionalProperties": false
        },
        "simple_types_secondary": {
            "type": "object",
            "properties": {
                "type": {"type": "string"}
            },
            "required": ["type"]
        },
        "object_type": {
            "type": "object",
            "properties": {
                "type": {"type": "string"},
                "properties": {
                    "type": "object",
                    "additionalProperties": {
                        "anyOf": [
                            {"$ref": "#/definitions/simple_types"},
                            {"$ref": "#/definitions/object_type"},
                            {"$ref": "#/definitions/array_type"}
                        ]
                    }
                },
                "constraints": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": ["req", "opt", "REF", "unq", "rcv", "idx"]
                    }
                }
            },
            "required": ["type", "properties" /*, "constraints" */]
        }
    }
};