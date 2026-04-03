export type SortDirection = 'ascending' | 'descending';

export function detectColumnType(values: string[]): 'numeric' | 'date' | 'string' {
	let numericCount = values.filter(v => !Number.isNaN(Number(v))).length;
	let dateCount = values.filter(v => Number.isNaN(Number(v)) && !Number.isNaN(new Date(v).getTime())).length;
	let stringCount = values.length - numericCount - dateCount;
	if (numericCount >= dateCount && numericCount >= stringCount) return 'numeric';
	if (dateCount >= numericCount && dateCount >= stringCount) return 'date';
	return 'string';
}

function normalizeColumnValue(value: string, detectedType: 'numeric' | 'date' | 'string'): number | string {
	if (detectedType === 'numeric') return Number(value);
	if (detectedType === 'date') return new Date(value).getTime();
	return value.toLowerCase();
}

export function getSortedColumnValues(values: string[], direction: SortDirection): string[] {
	let detectedType = detectColumnType(values);
	return [...values].sort((leftValue, rightValue) => {
		let leftNormalized = normalizeColumnValue(leftValue, detectedType);
		let rightNormalized = normalizeColumnValue(rightValue, detectedType);
		if (leftNormalized < rightNormalized) return direction === 'ascending' ? -1 : 1;
		if (leftNormalized > rightNormalized) return direction === 'ascending' ? 1 : -1;
		return 0;
	});
}
