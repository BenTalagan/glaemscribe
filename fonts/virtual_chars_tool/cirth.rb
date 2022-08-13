
# List of all virtuals (tehtar)
CIRTH_VIRTUALS_DS = {
  "TEHTA_CIRCUM"    => { names: ["TEHTA_CIRCUM"],     classes: ["TEHTA_CIRCUM_XS", "TEHTA_CIRCUM_S", "TEHTA_CIRCUM_L", "TEHTA_CIRCUM_XL"] },
  "TEHTA_UNDERLINE" => { names: ["TEHTA_UNDERLINE"],  classes: ["TEHTA_UNDERLINE_XS", "TEHTA_UNDERLINE_S", "TEHTA_UNDERLINE_L", "TEHTA_UNDERLINE_XL"] },
  "TEHTA_SUB_DOT"   => { names: ["TEHTA_SUB_DOT"],    classes: ["TEHTA_SUB_DOT_XS", "TEHTA_SUB_DOT_S", "TEHTA_SUB_DOT_L", "TEHTA_SUB_DOT_XL"] }
}

# List 
CIRTH_DIACTRITICS_WITH_SIMILAR_PLACEMENT_DS = [
   ["TEHTA_CIRCUM" ],
   ["TEHTA_UNDERLINE"],
   ["TEHTA_SUB_DOT"],
]

CIRTH_DIACRITICS_BEARERS = [
   "CIRTH_1",
   "CIRTH_2",
   "CIRTH_3",
   "CIRTH_4",
   "CIRTH_5",
   "CIRTH_6",
   "CIRTH_7",
   "CIRTH_8",
   "CIRTH_9",
   
   "CIRTH_10",
   "CIRTH_11",
   "CIRTH_12",
   "CIRTH_13",
   "CIRTH_14",
   "CIRTH_15",
   "CIRTH_16",
   "CIRTH_17",
   "CIRTH_18",
   "CIRTH_19",
   
   "CIRTH_20",
   "CIRTH_21",
   "CIRTH_22",
   "CIRTH_23",
   "CIRTH_24",
   "CIRTH_25",
   "CIRTH_26",
   "CIRTH_27",
   "CIRTH_28",
   "CIRTH_29",
   
   "CIRTH_30",
   "CIRTH_31",
   "CIRTH_32",
   "CIRTH_33",
   "CIRTH_34",
   "CIRTH_35",
   "CIRTH_36",
   "CIRTH_37",
   "CIRTH_38",
   "CIRTH_38_ALT",
   "CIRTH_39",
   
   "CIRTH_40",
   "CIRTH_41",
   "CIRTH_42",
   "CIRTH_43",
   "CIRTH_44",
   "CIRTH_45",
   "CIRTH_45_ALT",
   "CIRTH_46",
   "CIRTH_47",
   "CIRTH_48",
   "CIRTH_49",
   
   "CIRTH_50",
   "CIRTH_51",
   "CIRTH_51_ALT",
   "CIRTH_52",
   "CIRTH_52_ALT",
   "CIRTH_53",
   "CIRTH_54",
   "CIRTH_55",
   "CIRTH_55_ALT",
   "CIRTH_56",
   "CIRTH_56_ALT",
   "CIRTH_57",
   "CIRTH_58",
   "CIRTH_59",
   
   "CIRTH_60",
   
   "CIRTH_EREB_1",
   "CIRTH_EREB_2",
   "CIRTH_EREB_3",
   "CIRTH_EREB_4",
   "CIRTH_EREB_5",
   "CIRTH_EREB_6",
   "CIRTH_EREB_7",
   
   "CIRTH_NUMERAL_4"
 ]
 
CIRTH_DS_GENERIC_CONF = {
  :virtuals         => CIRTH_VIRTUALS_DS,
  :virtual_groups   => CIRTH_DIACTRITICS_WITH_SIMILAR_PLACEMENT_DS,
  :virtual_triggers => CIRTH_DIACRITICS_BEARERS
}
