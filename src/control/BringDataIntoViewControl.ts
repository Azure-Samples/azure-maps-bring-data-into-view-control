import * as azmaps from "azure-maps-control";
import { BringDataIntoViewControlOptions } from './BringDataIntoViewControlOptions';

/** A control that makes it easy to bring any data loaded on the map into view. */
export class BringDataIntoViewControl implements azmaps.Control {
    /****************************
    * Private Properties
    ***************************/

    private _container: HTMLElement;
    private _button: HTMLButtonElement;
    private _darkColor = '#011c2c';
    private _hclStyle: azmaps.ControlStyle = null;
    private _map: azmaps.Map;
    private _options: BringDataIntoViewControlOptions = {
        style: 'light',
        padding: 100,
        includeImageLayers: true,
        includeMarkers: true,
        sources: null
    };

    private _buttonCSS = '.azmaps-bringDataIntoViewBtn{margin:0;padding:0;border:none;border-collapse:collapse;width:32px;height:32px;text-align:center;cursor:pointer;line-height:32px;background-repeat:no-repeat;background-size:20px;background-position:center center;z-index:200;box-shadow:0px 0px 4px rgba(0,0,0,0.16);background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABcRAAAXEQHKJvM/AAAAB3RJTUUH4wMIFTgXULHJFAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAhUlEQVRo3u3asQ2AIBAF0MO4p42FI1nYOKlugAUnJvL+BLzwcxGw7Md5RUO2dSmRkNZ1TPGTgICADAIptbGXNVqzUluraoGADAKZv/rIy56UqvVFartVVEu1QEBAQEBAQEBAQEAaz+xuGlXrpWr1PlvbERAQEJCIhzfEnqPYLxwgICBjQW7ewSYPr/zk7gAAAABJRU5ErkJggg==);}' +
        '.azmaps-bringDataIntoViewBtn:hover{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABcRAAAXEQHKJvM/AAAAB3RJTUUH4wMIFTcYR5bISgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABDklEQVRo3u2aMQ+CMBSE7wjGwURXd1cHhb8Cv1L/ikDi7Goc1UESElMXN0UiLaToXcIEbe57vFd4TbneZnsAS7RUnkSEA623mbEZH9hA+KQAPyKBDAXEeOz5rbew5mECWAA4NUxKZ+6MGZMcNQRxDuDwDQgAlHkS3foKc5HGFYCqYYkuVewCEcifg4QWP3mzDr43zJPo0isIgHNHwWWbe8GHIaVv6ZMn0fHp+eWiRWqZjszyr4tdIAIRiEAEIhCBCEQgAhHI8Hr2ugbJGDMr0vjqk9nVZjclefnqjZCc+Bb1T55Cy7md76K0Tq2+e2sVu0AEIpDOQO4e+q31RBdbny6WYhdHOFQjAhGIQIajB80LO3KY+u0wAAAAAElFTkSuQmCC);}';

    /****************************
     * Constructor
     ***************************/

    /**
     * A control that makes it easy to bring any data loaded on the map into view.
     * @param options Options for defining how the control is rendered and functions.
     */
    constructor(options?: BringDataIntoViewControlOptions) {
        this.setOptions(options);
    }

    /****************************
     * Public Methods
     ***************************/

    /**
     * Action to perform when the control is added to the map.
     * @param map The map the control was added to.
     * @param options The control options used when adding the control to the map.
     * @returns The HTML Element that represents the control.
     */
    public onAdd(map: azmaps.Map, options?: azmaps.ControlOptions): HTMLElement {
        const self = this;
        const opt = self._options;
        self._map = map;

        const ariaLabel = BringDataIntoViewControl._getAriaLabel(map.getStyle().language);

        //Add the CSS style for the control to the DOM.
        const style = document.createElement('style');
        style.innerHTML = self._buttonCSS;
        document.body.appendChild(style);

        //Create a button container.
        const c = document.createElement('div');
        c.classList.add('azure-maps-control-container');
        c.setAttribute('aria-label', ariaLabel);
        c.style.flexDirection = 'column';
        self._container = c;

        //Create the button.
        const btn = document.createElement("button");
        btn.classList.add('azmaps-bringDataIntoViewBtn');
        btn.setAttribute('title', ariaLabel);
        btn.setAttribute('alt', ariaLabel);
        btn.setAttribute('type', 'button');
        self._button = btn;

        self._setStyle(opt.style);

        btn.addEventListener('click', () => {
            const bbox = azmaps.data.BoundingBox;

            //Logic that gets all shapes on the map and calculates the bounding box of the map.            
            let data: azmaps.data.Feature<azmaps.data.Geometry, any>[] = [];

            const sources = map.sources.getSources();
            sources.forEach(s => {
                if (s instanceof azmaps.source.DataSource) {
                    if (!opt.sources || (<string[]>opt.sources).indexOf(s.getId()) > -1) {
                        data = data.concat((<azmaps.source.DataSource>s).toJson().features);
                    }
                }
            });

            let bounds = null;

            if (data.length > 0) {
                bounds = bbox.fromData(data);
            }

            if (opt.includeMarkers) {
                let pos = [];

                for (let marker of map.markers.getMarkers()) {
                    pos.push(marker.getOptions().position);
                }

                if (pos.length > 0) {
                    let b = bbox.fromPositions(pos);
                    if (bounds === null) {
                        bounds = b;
                    } else {
                        bounds = bbox.merge(bounds, b);
                    }
                }
            }

            if (opt.includeImageLayers) {
                const l = map.layers.getLayers();
                for (let i = 0; i < l.length; i++) {
                    if (l[i] instanceof azmaps.layer.ImageLayer) {
                        let b = bbox.fromPositions((<azmaps.layer.ImageLayer>l[i]).getOptions().coordinates);

                        if (bounds === null) {
                            bounds = b;
                        } else {
                            bounds = bbox.merge(bounds, b);
                        }
                    }
                }
            }

            if (bounds !== null) {
                const w = bbox.getWidth(bounds);
                const h = bbox.getHeight(bounds);

                //If the bounding box is really small, likely a single point, use center/zoom.
                if (w < 0.00001 && h < 0.00001) {
                    map.setCamera({
                        center: bbox.getCenter(bounds),
                        zoom: 17
                    });
                } else {
                    map.setCamera({
                        bounds: bounds,
                        padding: self._options.padding
                    });
                }
            }
        });

        c.appendChild(btn);
        return c;
    }

    /**
     * Action to perform when control is removed from the map.
     */
    public onRemove(): void {
        const self = this;
        if (self._container) {
            self._container.remove();
            self._container = null;
        }

        if (self._options.style === 'auto') {
            self._map.events.remove('styledata', self._mapStyleChanged);
        }

        self._map = null;
    }

    /**
     * Sets the options on the control.
     * @param options The options to set.
     */
    public setOptions(opt: BringDataIntoViewControlOptions): void {
        if (opt) {
            const o = this._options;

            if (typeof opt.padding === 'number' && opt.padding >= 0) {
                o.padding = opt.padding;
            }

            if (typeof opt.includeImageLayers === 'boolean') {
                o.includeImageLayers = opt.includeImageLayers;
            }

            if (typeof opt.includeMarkers === 'boolean') {
                o.includeMarkers = opt.includeMarkers;
            }

            if (opt.style) {
                this._setStyle(opt.style);
            }

            if (opt.sources !== undefined) {
                if (opt.sources === null || opt.sources.length === 0) {
                    o.sources = null;
                } else {
                    const sources: string[] = [];

                    opt.sources.forEach(s => {
                        sources.push((s instanceof azmaps.source.DataSource) ? s.getId() : s);
                    });

                    o.sources = sources;
                }
            }
        }
    }

    /****************************
     * Private Methods
     ***************************/

    /**
     * Sets the style of the control.
     * @param style The style to set.
     * @returns 
     */
    private _setStyle(style): void {
        const self = this;
        const map = self._map;

        //Of style is already 'auto', remove the map event.
        if (self._options.style === 'auto' && map) {
            map.events.remove('styledata', self._mapStyleChanged);
        }

        let color = 'light';

        if (self._hclStyle) {
            if (self._hclStyle === 'dark') {
                color = self._darkColor;
            }
        } else {
            color = style;
        }

        if (color === 'light') {
            color = 'white';
        } else if (color === 'dark') {
            color = self._darkColor;
        } else if (color === 'auto') {
            if(map){
                //Color will change between light and dark depending on map style.
                map.events.add('styledata', self._mapStyleChanged);
            }
            color = self._getColorFromMapStyle();
        }

        self._options.style = style;

        if(self._button){
            self._button.style.backgroundColor = color;
        }
    }

    /**
     * An event handler for when the map style changes. Used when control style is set to auto.
     */
    private _mapStyleChanged = () => {
        const self = this;
        if (self._button && !self._hclStyle) {
            self._button.style.backgroundColor = self._getColorFromMapStyle();
        }
    }

    /**
     * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
     */
    private _getColorFromMapStyle(): string {
        //When the style is dark (i.e. satellite, night), show the dark colored theme.
        if (['satellite', 'satellite_road_labels', 'grayscale_dark', 'night'].indexOf(this._map.getStyle().style) > -1) {
            return this._darkColor;
        }

        return 'white';
    }

    /**
     * Returns the set of translation text resources needed for the center and zoom control for a given language.
     * @param lang The language code to retrieve the text resources for.
     * @returns The translated text for the aria label for the center and zoom control.
     */
    private static _getAriaLabel(lang?: string): string {
        if (lang && lang.indexOf('-') > 0) {
            lang = lang.substring(0, lang.indexOf('-'));
        }

        const resx = {
            'af': 'Bring data in die oog',
            'ar': 'جلب البيانات في الرأي',
            'eu': 'Ekarri datuak ikusteko',
            'bg': 'Привеждане на данните в изглед',
            'zh': '将数据带入视图',
            'hr': 'Donesite podatke u prikaz',
            'cs': 'Přenést data do zobrazení',
            'da': 'Få vist data i visningen',
            'nl': 'Gegevens in beeld brengen',
            'et': 'Andmete vaatamine',
            'fi': 'Tuo tiedot näkymään',
            'fr': 'Mettre les données en vue',
            'gl': 'Fai ver os datos',
            'de': 'Daten in den Blick bringen',
            'el': 'Εισαγωγή δεδομένων σε προβολή',
            'hi': 'डेटा को दृश्य में लाएं',
            'hu': 'Adatok áthozása a nézetbe',
            'id': 'Bawa data ke tampilan',
            'it': 'Portare i dati in vista',
            'ja': 'データをビューに取り込む',
            'kk': 'Деректерді көрініске енгізіңіз',
            'ko': '데이터를 뷰로 가져오기',
            'es': 'Lleve los datos a la vista',
            'lv': 'Datu skatīšana skatā',
            'lt': 'Atvesti duomenis į rodinį',
            'ms': 'Membawa data ke dalam paparan',
            'nb': 'Hent data til visning',
            'pl': 'Przynieś dane do widoku',
            'pt': 'Colocar os dados em exibição',
            'ro': 'Aducerea datelor în vizualizare',
            'ru': 'Перенесите данные в представление',
            'sr': 'Uskladi podatke u prikaz',
            'sk': 'Preniesť údaje do zobrazenia',
            'sl': 'Prinesite podatke v pogled',
            'sv': 'Ta fram data i vyn',
            'th': 'นำข้อมูลมาไว้ในมุมมอง',
            'tr': 'Verileri görünüme getirme',
            'uk': 'Приведення даних у режим перегляду',
            'vi': 'Mang dữ liệu vào chế độ xem',
            'en': 'Bring data into view'
        };

        const val = resx[lang.toLowerCase()];

        if (val) {
            return val;
        }

        return resx['en'];
    }
}