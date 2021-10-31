function quantile(arr, q) {
	if(!arr.length) return 'nd'
    const sorted = arr.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined) {
        return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
    } else {
        return Math.floor(sorted[base]);
    }
};

function prepareData(result) {
	return result.data.map(item => {
		item.date = item.timestamp.split('T')[0];
		return item;
	});
}

function showMetricByPeriod(data, page, dateFrom, dateTo) {
	console.log(`All metrics for period ${dateFrom}/${dateTo}`);
	let table = {};
	const datesFromPeriod = (dateFrom, dateTo) => {
		let start = new Date(dateFrom);
		let to = new Date(dateTo);
		let result = [];
		const day = 24 * 60 * 60 * 1000;
		while(to >= start) {
			result.push(start);
			start =  new Date(+start + day)
		}
		return result.map(date => date.toISOString().split('T')[0])
	}
	const period = datesFromPeriod(dateFrom, dateTo);

	table.connect = addMetricByDate(data, page, 'connect', period);
	table.ttfb = addMetricByDate(data, page, 'ttfb', period);
	table.lcp = addMetricByDate(data, page, 'lcp', period);
	table.fid = addMetricByDate(data, page, 'fid', period);
	table.download = addMetricByDate(data, page, 'download', period);

	console.table(table);
}

function showSession(sessionId, data) {
	console.log(`Session for ${sessionId}`);
	let table = {};
	data.filter(item => item.requestId === sessionId)
		.forEach(item => table[item.name] = item.value);
	console.table(table);	
}

function compareMetric(data, ...slicers) {
	let text = slicers.reduce((text, next, i, arr) => {
		text += `${next.name}-${next.value}`
		if(i + 1 !== arr.length) text += ' and ';
		return text
	}, '')
	console.log(`Compare metrics ${text}`);
	let table = slicers.map(slicer => sliceMetric(data, slicer))
			.map(slicedMetric => calcMetrics(slicedMetric))
			.reduce((res, next) => {
				for(let metric of Object.keys(res)) {
					for(let point of Object.keys(res[metric])) {
						res[metric][point] += '/' + next[metric][point]
					}
				}
				return res
			})
	console.table(table);
}

function addMetric(data, name) {
	let sampleData = data
					.filter(item => item.name == name)
					.map(item => item.value);
	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}
function calcMetrics(data) {
	let table = {};
	table.connect = addMetric(data, 'connect');
	table.ttfb = addMetric(data, 'ttfb');
	table.lcp = addMetric(data, 'lcp');
	table.fid = addMetric(data, 'fid');
	table.download = addMetric(data, 'download');
	return table;
};
function addMetricByDate(data, page, name, date) {
	let sampleData = data
					.filter(item => item.page == page && item.name == name && (date.includes(item.date)|| date === item.date))
					.map(item => item.value);

	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}
function showMetricsByDate(data, page, date) {
	console.log(`All metrics for ${date}:`);
	let table = {};
	table.connect = addMetricByDate(data, page, 'connect', date);
	table.ttfb = addMetricByDate(data, page, 'ttfb', date);
	table.lcp = addMetricByDate(data, page, 'lcp', date);
	table.fid = addMetricByDate(data, page, 'fid', date);
	table.download = addMetricByDate(data, page, 'download', date);

	console.table(table);
};
function sliceMetric(data, slice) {
	return data.filter(item => item.additional[slice.name] === slice.value)
};

const id = "1297572e-2ca2-4699-bcfa-21225b24d444";
fetch(`https://shri.yandex/hw/stat/data?counterId=${id}`)
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);
		showMetricsByDate(data, 'main page', '2021-10-30');
		showMetricByPeriod(data, 'main page', '2021-10-30', '2021-10-31');
		showSession('7eac46b1-e8ca-4a30-a0d0-62edaa144417', data);
		compareMetric(data, {name: 'platform', value: "desktop"}, {name: 'platform', value: "touch"})
	});
