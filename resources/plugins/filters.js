import Vue from "vue"
import moment from "moment"

Vue.filter('formatDate', function (value, format) {
  if (value) {
    return moment(String(value)).format(format)
  }
})

Vue.filter('formatLang', function (value, languages) {
  let language = ''
  const found = languages.find(item => item.CODE === value)
  if (found) {
    language = found.NAME
  }
  return language
})

Vue.filter('hidePassword', function (value) {
  if (value) {
    return value.replace(/./g, '•')
  }
})

Vue.filter('formatFromCode', function (value, listItems, itemValue, itemText) {
  let text = ''
  const found = listItems.find(item => item[`${itemValue}`] === value)
  if (found) {
    text = found[`${itemText}`]
  }
  return text
})

Vue.filter('formatCurrency', function (value, prefit, precision) {
  /*Return value number with format
  value: number input
  prefit: prefit, it like description for value input
  precision: value round number
  ex: formatCurrency(123456789,'VND',2) => VND 123,456,789.00
  */
  return prefit + "" + value.toFixed(precision).replace(/./g, function (c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
  });
})

Vue.filter('formatMonth', function (value, format) {
  let rtn = '';
  if (value) {
    let date = moment(String(value), "YYYYMM");
    rtn = moment(date).format(format);
  }
  return rtn;
})

Vue.filter('formatNumber', function (value, precision) {
  return parseFloat(value)
    .toFixed(precision)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
})

Vue.filter('prettyBytes', function (bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
})
