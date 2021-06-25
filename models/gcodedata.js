export class GCodeData {
  constructor(mi, ma, adata) {
    Object.assign(this, { _min: mi, _max: ma, _data: adata });
  }
  get min() {
    return this._min;
  }
  get max() {
    return this._max;
  }
  get lines() {
    return this._lines;
  }
  get data() {
    return this._data;
  }
}
