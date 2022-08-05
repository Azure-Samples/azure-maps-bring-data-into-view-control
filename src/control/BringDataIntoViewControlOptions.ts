import * as azmaps from "azure-maps-control";

/** Options for the BringDataIntoViewControl. */
export interface BringDataIntoViewControlOptions {
    /**
    * The style of the control. Can be; light, dark, auto, or any CSS3 color. When set to auto, the style will change based on the map style.
    * Default `light'.
    * @default light
    */
     style?: azmaps.ControlStyle | string;
 
    /** The amount of pixel padding around the data to account for when setting the map view. Default: 100 */
    padding?: number;

    /** An arrary of data source objects or IDs to focus on. By default this control will calculate the coverage area of DataSource instances in the map. */
    sources?: (azmaps.source.DataSource | string)[];

    /** Specifies if HTML markers should be included in the data view calculation: Default: true */
    includeMarkers?: boolean;

    /** Specifies if image layer should be included in the data view calculation: Default: true */
    includeImageLayers?: boolean;
 }
 