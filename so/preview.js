// http://api-prod.sudouest.fr/004/articles/read/?articleid=123&appid=SO-5674483c4e

var baseReplacements = {
  COLOR_PRIMARY: '#02a9f4',
  JSON_SETTINGS: JSON.stringify({
    scheme_identifier: 'comsudouest',
    subscription_link: 'comsudouest://subscription',
    login_link: 'comsudouest://login',
    font_size: '100%',
    check_access_article: 0,
    dfp_publisherid: '/25384414/'
  }),
  JSON_CONSTANTS: JSON.stringify({
    from: 'Par'
  }),
  TARIF_ABONNEMENT: '14.90',
  DEBUG: false,
  DEVICE_CLASS: 'none',
  ORIENTATION_CLASS: 'portrait'
}

function cleanScripts (str) {
  return str.replace(/<\/script>/g, '<" + "/script>')
}

window.onload = function () {
  var frame = document.getElementById('frame')
  var params = getParams()

  baseReplacements.DEBUG = !!params.debug

  if (params.articleId) {
    window.$.ajax(getURL(params))
    .done(function (data) {
      var article = data.response.article
      baseReplacements.JSON_ARTICLE = cleanScripts(JSON.stringify(article))
      baseReplacements.JSON_RELATED_ARTICLES = JSON.stringify(article.toread.map(function (o) {
        return [o.title, '#' + o.article_id]
      }))
      baseReplacements.TOPIC = last(article.topics).name
      baseReplacements.DATE_ARTICLE = formatDate(new Date(article.creation_date))
      baseReplacements.DATE_UPDATE_ARTICLE = formatDate(new Date(article.update_date))
      baseReplacements.COMPLEMENTS = '<div>' + article.complements.join('</div><div>') + '</div>'
      baseReplacements.HEADER_EMBED = '<div style="max-width: none; margin-left: -5px;"><img src="' + article.pictures[0].url_02 + '"><script type="text/javascript">function sendObjcPageLoaded () {}</script></div>'

      var html = generatePage()
      frame.contentDocument.write(html)
    })
    .fail(function (xhr, status, err) {
      console.error(status, err)
    })
  }
}

function getURL (params) {
  return 'http://api-prod.sudouest.fr/004/articles/read/?articleid=' + params.articleId + '&appid=SO-5674483c4e'
}

function generatePage () {
  return window.tpl.replace(/@([A-Z_]+)@/g, function (m, key) {
    return baseReplacements[key]
  })
}

function getParams () {
  var paramsString = document.location.href.split('?')[1]
  if (paramsString) {
    var tuples = paramsString.split('&').map(function (s) {
      return s.split('=')
    })

    var params = {}
    tuples.forEach(function (a) {
      params[a[0]] = a[1]
    })

    return params
  }
}

var DAYS = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi'
]
var MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
]

function formatDate (date) {
  return [
    DAYS[date.getDay()],
    date.getDate(),
    MONTHS[date.getMonth()],
    date.getFullYear(),
    'à',
    fill(date.getHours()) + 'h' + fill(date.getMinutes())
  ].join(' ')
}

function fill (s) {
  while (String(s).length < 2) {
    s = '0' + s
  }
  return s
}

function last (a) { return a[a.length - 1] }
