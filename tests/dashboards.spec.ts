import { expect, test } from '@playwright/test';
import { deleteDashboardByID, getAllDashboards } from '@aiexpert-api/conversation_service/api';

test('get all dashboards and print published/unpublished counts', async ({ page }) => {
	const dashboards = await getAllDashboards(page) as Array<{ id?: string; status?: string }>;
	const publishedDashboards = dashboards.filter((dashboard) => dashboard.status?.toLowerCase() === 'published');
	const unpublishedDashboards = dashboards.filter((dashboard) => dashboard.status?.toLowerCase() === 'unpublished');
	const publishedCount = publishedDashboards.length;
	const unpublishedCount = unpublishedDashboards.length;

	console.log(`Published canvas count: ${publishedCount}`);
	console.log(`Unpublished canvas count: ${unpublishedCount}`);

	if (publishedCount > 2) {
		const dashboardToDelete = publishedDashboards.find((dashboard) => Boolean(dashboard.id));
		if (dashboardToDelete?.id) {
			await deleteDashboardByID(page, dashboardToDelete.id);
			console.log(`Deleted published canvas id: ${dashboardToDelete.id}`);
		}
	} 
    if (unpublishedCount > 9) {
		const dashboardToDelete = unpublishedDashboards.find((dashboard) => Boolean(dashboard.id));
		if (dashboardToDelete?.id) {
			await deleteDashboardByID(page, dashboardToDelete.id);
			console.log(`Deleted unpublished canvas id: ${dashboardToDelete.id}`);
		}
	}


});