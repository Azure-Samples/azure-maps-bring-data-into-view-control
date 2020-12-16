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
 }
 