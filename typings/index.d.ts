import * as azmaps from 'azure-maps-control';

declare namespace atlas {    

    export module control {

        /** A control that makes it easy to bring any data loaded on the map into view. */
        export class BringDataIntoViewControl implements azmaps.Control {

            /**
             * A control that makes it easy to bring any data loaded on the map into view.
             * @param options Options for defining how the control is rendered and functions.
             */
            constructor(options?: BringDataIntoViewControlOptions);

            onAdd(map: azmaps.Map, options?: azmaps.ControlOptions): HTMLElement;

            onRemove(): void;
        }
    }

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
}

export = atlas;