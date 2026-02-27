/**
 * Custom Highlight.js language definitions for domain-specific languages
 * used in ERX Blog: Excel formulas, DAX, VBA, Power Query M, R
 */
import type { HLJSApi, Language } from 'highlight.js';

// ===== Excel Formula Language =====
export function excelFormula(hljs: HLJSApi): Language {
    const EXCEL_FUNCTIONS = [
        // Math
        'SUM', 'SUMIF', 'SUMIFS', 'SUMPRODUCT', 'AVERAGE', 'AVERAGEIF', 'AVERAGEIFS',
        'COUNT', 'COUNTA', 'COUNTBLANK', 'COUNTIF', 'COUNTIFS',
        'MAX', 'MAXIFS', 'MIN', 'MINIFS', 'ROUND', 'ROUNDUP', 'ROUNDDOWN',
        'ABS', 'INT', 'MOD', 'POWER', 'SQRT', 'RAND', 'RANDBETWEEN',
        // Lookup
        'VLOOKUP', 'HLOOKUP', 'XLOOKUP', 'INDEX', 'MATCH', 'XMATCH',
        'OFFSET', 'INDIRECT', 'CHOOSE', 'LOOKUP',
        // Text
        'LEFT', 'RIGHT', 'MID', 'LEN', 'FIND', 'SEARCH', 'SUBSTITUTE',
        'REPLACE', 'TRIM', 'CLEAN', 'UPPER', 'LOWER', 'PROPER',
        'CONCATENATE', 'CONCAT', 'TEXTJOIN', 'TEXT', 'VALUE', 'REPT',
        // Date
        'DATE', 'DATEVALUE', 'TODAY', 'NOW', 'YEAR', 'MONTH', 'DAY',
        'HOUR', 'MINUTE', 'SECOND', 'WEEKDAY', 'WEEKNUM', 'EOMONTH',
        'EDATE', 'DATEDIF', 'NETWORKDAYS', 'WORKDAY',
        // Logical
        'IF', 'IFS', 'IFERROR', 'IFNA', 'AND', 'OR', 'NOT', 'XOR',
        'SWITCH', 'TRUE', 'FALSE',
        // Array & Dynamic
        'FILTER', 'SORT', 'SORTBY', 'UNIQUE', 'SEQUENCE', 'RANDARRAY',
        'LET', 'LAMBDA', 'MAP', 'REDUCE', 'SCAN', 'MAKEARRAY', 'BYROW', 'BYCOL',
        'TOCOL', 'TOROW', 'WRAPCOLS', 'WRAPROWS', 'TAKE', 'DROP', 'EXPAND',
        'HSTACK', 'VSTACK', 'CHOOSECOLS', 'CHOOSEROWS', 'TEXTSPLIT',
        // Info
        'ISBLANK', 'ISERROR', 'ISNA', 'ISNUMBER', 'ISTEXT', 'TYPE', 'ROW', 'COLUMN',
        'ROWS', 'COLUMNS', 'CELL', 'INFO',
        // Financial
        'PV', 'FV', 'PMT', 'RATE', 'NPV', 'IRR', 'XIRR', 'XNPV',
    ];

    return {
        name: 'Excel Formula',
        case_insensitive: true,
        contains: [
            // Function names
            {
                className: 'built_in',
                begin: '\\b(' + EXCEL_FUNCTIONS.join('|') + ')\\b',
            },
            // Cell references like A1, $A$1, Sheet1!A1
            {
                className: 'variable',
                begin: /(\$?[A-Z]{1,3}\$?\d+)(:\$?[A-Z]{1,3}\$?\d+)?/,
            },
            // Sheet reference
            {
                className: 'title',
                begin: /[A-Za-z_][\w.]*!/,
            },
            // Strings
            hljs.QUOTE_STRING_MODE,
            // Numbers
            hljs.NUMBER_MODE,
            // Operators
            {
                className: 'operator',
                begin: /[+\-*/^&=<>]+/,
            },
            // Named ranges / structured references
            {
                className: 'symbol',
                begin: /\[[\w\s]+\]/,
            },
        ],
    };
}

// ===== DAX (Data Analysis Expressions) Language =====
export function daxLanguage(hljs: HLJSApi): Language {
    const DAX_FUNCTIONS = [
        // Aggregation
        'SUM', 'SUMX', 'AVERAGE', 'AVERAGEX', 'COUNT', 'COUNTA', 'COUNTX',
        'COUNTROWS', 'COUNTBLANK', 'DISTINCTCOUNT', 'DISTINCTCOUNTNOBLANK',
        'MIN', 'MINX', 'MAX', 'MAXX', 'MEDIAN', 'PRODUCT', 'PRODUCTX',
        // Filter
        'CALCULATE', 'CALCULATETABLE', 'FILTER', 'ALL', 'ALLEXCEPT',
        'ALLSELECTED', 'REMOVEFILTERS', 'KEEPFILTERS', 'VALUES', 'DISTINCT',
        'EARLIER', 'EARLIEST', 'HASONEVALUE', 'HASONEFILTER', 'ISFILTERED',
        'ISCROSSFILTERED', 'SELECTEDVALUE', 'USERELATIONSHIP',
        // Table manipulation
        'ADDCOLUMNS', 'SUMMARIZE', 'SUMMARIZECOLUMNS', 'SELECTCOLUMNS',
        'TOPN', 'GENERATE', 'GENERATEALL', 'CROSSJOIN', 'UNION', 'INTERSECT',
        'EXCEPT', 'NATURALINNERJOIN', 'NATURALLEFTOUTERJOIN', 'DATATABLE',
        'ROW', 'GROUPBY', 'TREATAS',
        // Time intelligence
        'TOTALYTD', 'TOTALQTD', 'TOTALMTD', 'DATESYTD', 'DATESQTD', 'DATESMTD',
        'SAMEPERIODLASTYEAR', 'DATEADD', 'DATESBETWEEN', 'DATESINPERIOD',
        'PARALLELPERIOD', 'PREVIOUSDAY', 'PREVIOUSMONTH', 'PREVIOUSQUARTER',
        'PREVIOUSYEAR', 'NEXTDAY', 'NEXTMONTH', 'NEXTQUARTER', 'NEXTYEAR',
        'STARTOFMONTH', 'STARTOFQUARTER', 'STARTOFYEAR',
        'ENDOFMONTH', 'ENDOFQUARTER', 'ENDOFYEAR', 'CALENDAR', 'CALENDARAUTO',
        // Text
        'CONCATENATE', 'CONCATENATEX', 'FORMAT', 'LEFT', 'RIGHT', 'MID',
        'LEN', 'UPPER', 'LOWER', 'TRIM', 'SUBSTITUTE', 'REPLACE', 'REPT',
        'SEARCH', 'FIND', 'EXACT', 'FIXED', 'UNICHAR', 'UNICODE', 'COMBINEVALUES',
        // Logical
        'IF', 'AND', 'OR', 'NOT', 'SWITCH', 'TRUE', 'FALSE', 'IFERROR',
        'ISBLANK', 'ISERROR', 'COALESCE', 'IN',
        // Math
        'ABS', 'CEILING', 'FLOOR', 'ROUND', 'ROUNDUP', 'ROUNDDOWN',
        'INT', 'MOD', 'POWER', 'SQRT', 'DIVIDE', 'QUOTIENT', 'SIGN',
        'RANKX', 'RANK.EQ', 'PERCENTILE.INC', 'PERCENTILE.EXC',
        // Relationship
        'RELATED', 'RELATEDTABLE', 'LOOKUPVALUE', 'PATHCONTAINS', 'PATH',
        // Iterators
        'MAXX', 'MINX', 'AVERAGEX', 'SUMX', 'COUNTX', 'RANKX',
        // Info
        'ISBLANK', 'ISERROR', 'ISNUMBER', 'ISTEXT', 'ISLOGICAL', 'ISNONTEXT',
        'BLANK', 'ERROR', 'USERNAME', 'USERPRINCIPALNAME',
        // Variables
        'VAR', 'RETURN',
    ];

    return {
        name: 'DAX',
        case_insensitive: true,
        keywords: {
            keyword: 'VAR RETURN DEFINE MEASURE EVALUATE ORDER BY ASC DESC',
        },
        contains: [
            {
                className: 'built_in',
                begin: '\\b(' + DAX_FUNCTIONS.join('|') + ')\\s*\\(',
                returnBegin: true,
                contains: [{ begin: '\\b(' + DAX_FUNCTIONS.join('|') + ')\\b', className: 'built_in' }],
            },
            // Table[Column] reference
            {
                className: 'variable',
                begin: /'[^']*'\[/,
                end: /\]/,
            },
            {
                className: 'variable',
                begin: /\w+\[[\w\s]+\]/,
            },
            // Strings
            hljs.QUOTE_STRING_MODE,
            // Numbers
            hljs.NUMBER_MODE,
            // Line comments
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
        ],
    };
}

// ===== Power Query M Language =====
export function powerQueryM(hljs: HLJSApi): Language {
    return {
        name: 'Power Query M',
        case_insensitive: false,
        keywords: {
            keyword: 'let in if then else each try otherwise as is type not and or meta error',
            literal: 'true false null',
        },
        contains: [
            // Built-in functions (common ones)
            {
                className: 'built_in',
                begin: /\b(Table|List|Record|Text|Number|Date|DateTime|DateTimeZone|Duration|Time|Logical|Type|Binary|Lines|Splitter|Combiner|Comparer|Expression|Error|Value|Function|Action|Json|Csv|Excel|Sql|Web|File|Folder|SharePoint|OData|Xml|Html|Hdfs|AzureStorage|GoogleBigQuery|Salesforce|Oracle|PostgreSQL|MySQL|Odbc|OleDb|Access|ActiveDirectory|AnalysisServices|Cube)\.[A-Za-z]+\b/,
            },
            // #shared, #sections
            {
                className: 'meta',
                begin: /#(shared|sections|table|date|time|datetime|datetimezone|duration)/,
            },
            // Strings
            hljs.QUOTE_STRING_MODE,
            // Numbers
            hljs.NUMBER_MODE,
            // Line comments
            hljs.C_LINE_COMMENT_MODE,
            // Block comments
            hljs.C_BLOCK_COMMENT_MODE,
            // Operators
            {
                className: 'operator',
                begin: /=>|<>|<=|>=|<|>|=|&|\+|-|\*|\/|@/,
            },
            // Field access
            {
                className: 'variable',
                begin: /\[[^\]]+\]/,
            },
        ],
    };
}

// ===== VBA (Visual Basic for Applications) =====
export function vbaLanguage(hljs: HLJSApi): Language {
    return {
        name: 'VBA',
        case_insensitive: true,
        keywords: {
            keyword:
                'Sub End Function Property Get Let Set If Then Else ElseIf End Select Case ' +
                'For Each Next To Step Do While Until Loop Wend With GoTo GoSub Return ' +
                'Exit Dim ReDim Preserve As New Private Public Static Global Const ' +
                'Type Enum Class Module ByVal ByRef Optional ParamArray ' +
                'On Error Resume GoTo Call Me Nothing Empty Null ' +
                'Is Like And Or Not Xor Imp Eqv Mod ' +
                'Option Explicit Base Compare Event RaiseEvent Implements ' +
                'Friend WithEvents Attribute',
            literal: 'True False Nothing Empty Null vbCrLf vbTab vbNewLine',
            type:
                'String Integer Long Single Double Boolean Date Currency Variant Object Byte ' +
                'LongLong LongPtr Collection Dictionary',
            built_in:
                'MsgBox InputBox Debug Print Err Range Cells Sheets Worksheets ' +
                'Workbooks ActiveSheet ActiveWorkbook ActiveCell Selection ThisWorkbook ' +
                'Application DoEvents Chr Asc Val Str CStr CInt CLng CDbl CBool CDate ' +
                'Format Left Right Mid Len InStr InStrRev Replace Trim LTrim RTrim ' +
                'UCase LCase Split Join Array UBound LBound IsEmpty IsNull IsNumeric IsDate IsArray ' +
                'Now Date Time Year Month Day Hour Minute Second DateAdd DateDiff DatePart ' +
                'Dir Kill FileCopy MkDir RmDir Name Open Close Put Get Write ' +
                'CreateObject GetObject TypeName VarType RGB',
        },
        contains: [
            hljs.QUOTE_STRING_MODE,
            hljs.NUMBER_MODE,
            {
                className: 'comment',
                begin: /'/,
                end: /$/,
            },
            {
                className: 'comment',
                begin: /\bRem\b/,
                end: /$/,
                case_insensitive: true,
            },
            // Line continuation
            {
                className: 'meta',
                begin: /_$/,
            },
        ],
    };
}

// ===== Register all custom languages =====
export function registerCustomLanguages(lowlight: any) {
    lowlight.register('excel', excelFormula);
    lowlight.register('dax', daxLanguage);
    lowlight.register('powerquery', powerQueryM);
    lowlight.register('m', powerQueryM);     // Alias
    lowlight.register('vba', vbaLanguage);
    lowlight.register('vb', vbaLanguage);    // Alias
}

// ===== Language options for the editor dropdown =====
export const CODE_LANGUAGES = [
    { value: '', label: 'Auto' },
    // Web
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    // Data & Office
    { value: 'excel', label: 'Excel Formula' },
    { value: 'dax', label: 'DAX' },
    { value: 'powerquery', label: 'Power Query M' },
    { value: 'vba', label: 'VBA' },
    { value: 'sql', label: 'SQL' },
    // Programming
    { value: 'python', label: 'Python' },
    { value: 'r', label: 'R' },
    { value: 'csharp', label: 'C#' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    // Shell & Config
    { value: 'bash', label: 'Bash / Shell' },
    { value: 'powershell', label: 'PowerShell' },
    { value: 'yaml', label: 'YAML' },
    { value: 'dockerfile', label: 'Dockerfile' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'plaintext', label: 'Plain Text' },
];

// ===== Display name mapping for blog rendering =====
export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    html: 'HTML',
    css: 'CSS',
    sql: 'SQL',
    bash: 'Bash',
    json: 'JSON',
    xml: 'XML',
    excel: 'Excel Formula',
    dax: 'DAX',
    powerquery: 'Power Query M',
    m: 'Power Query M',
    vba: 'VBA',
    vb: 'VBA',
    r: 'R',
    csharp: 'C#',
    java: 'Java',
    cpp: 'C++',
    go: 'Go',
    rust: 'Rust',
    php: 'PHP',
    ruby: 'Ruby',
    swift: 'Swift',
    kotlin: 'Kotlin',
    powershell: 'PowerShell',
    yaml: 'YAML',
    dockerfile: 'Dockerfile',
    markdown: 'Markdown',
    plaintext: 'Text',
    code: 'Code',
};
