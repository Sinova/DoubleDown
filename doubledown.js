const markers = {
	'#' : {tag : 'code', pre : true},
	'$' : {tag : 'kbd',  pre : true},
	'_' : {tag : 'u'},
	'*' : {tag : 'strong'},
	'/' : {tag : 'em'},
	'@' : {tag : 'blockquote'},
	'~' : {tag : 's'},
	'%' : {tag : 'sub'},
	'^' : {tag : 'sup'},
};

const html_escape_regexp   = /([&<>="`'])/g;
const trim_newline_regexp  = /^[\t\r ]*\n|\r?\n[\t\r ]*$/g;
const link_regexp          = /\[([^\]]*?)\]\(([^\)]*?)\)/g;
const marker_characters    = Object.keys(markers).map((a) => a.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$&'));
const marker_escape_regexp = new RegExp(marker_characters.join('|'), 'g');
const marker_regexp        = new RegExp(`(${marker_characters.join('{2}|')}{2})([\\s\\S]*?)\\1|((?:\\s*\\n\\s*){2,})|\\s+`, 'g');
const replaceEntity        = (match) => `&#${match.charCodeAt()};`;
const replaceLink          = (match, text, href) => text && href ? `<a rel="nofollow noreferrer noopener" target="_blank" href="${href.replace(marker_escape_regexp, replaceEntity)}">${parseMarkers(text)}</a>` : '';
const replaceMarker        = (match, marker, text, newline) => marker ? `<${markers[marker[0]].tag}>${markers[marker[0]].pre ? text.replace(trim_newline_regexp, '') : parseMarkers(text)}</${markers[marker[0]].tag}>` : newline ? '<br><br>' : ' ';
const parseMarkers         = (text) => text.replace(marker_regexp, replaceMarker);

export default function format(text) {
	return parseMarkers(text.trim().replace(html_escape_regexp, replaceEntity).replace(link_regexp, replaceLink));
}
