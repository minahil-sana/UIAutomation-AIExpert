import { Page } from '@playwright/test';
import { deleteDashboardByID, getAllDashboards } from '@aiexpert-api/conversation_service/api';

export async function fetchDashboards(page: Page): Promise<{
	published: Array<{ id?: string; status?: string }>;
	unpublished: Array<{ id?: string; status?: string }>;
}> {
	const dashboards = await getAllDashboards(page);
	const published = dashboards.filter((dashboard) => dashboard.status?.toLowerCase() === 'published');
	const unpublished = dashboards.filter((dashboard) => dashboard.status?.toLowerCase() === 'unpublished');
	return { published, unpublished };
}

export async function verifyDashboardCount(
	page: Page,
	publishedMax: number = 2,
	unpublishedMax: number = 9,
): Promise<{ publishedCount: number; unpublishedCount: number }> {
	let { published, unpublished } = await fetchDashboards(page);

	while (published.length > publishedMax) {
		const dashboardToDelete = published.find((dashboard) => Boolean(dashboard.id));
		if (!dashboardToDelete?.id) {
			break;
		}
		await deleteDashboardByID(page, dashboardToDelete.id);
		console.log(`Deleted published canvas id: ${dashboardToDelete.id}`);
		({ published, unpublished } = await fetchDashboards(page));
	}

	while (unpublished.length > unpublishedMax) {
		const dashboardToDelete = unpublished.find((dashboard) => Boolean(dashboard.id));
		if (!dashboardToDelete?.id) {
			break;
		}
		await deleteDashboardByID(page, dashboardToDelete.id);
		console.log(`Deleted unpublished canvas id: ${dashboardToDelete.id}`);
		({ published, unpublished } = await fetchDashboards(page));
	}

	return { publishedCount: published.length, unpublishedCount: unpublished.length };
}
