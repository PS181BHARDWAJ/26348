import assert from 'assert';

async function run() {
  try {
    const solverMod = await import('../vehicle_maintence_scheduler/src/solver.js');
    const serviceMod = await import('../notification_app_be/src/service.js');

    const { solveMaintenanceSchedule } = solverMod;
    const { getTopNotifications } = serviceMod;

    // Solver tests
    const tasks = [
      { TaskID: 'a', Duration: 3, Impact: 4 },
      { TaskID: 'b', Duration: 4, Impact: 5 },
      { TaskID: 'c', Duration: 2, Impact: 3 }
    ];

    const plan = solveMaintenanceSchedule(tasks, 5);
    assert.strictEqual(plan.budgetHours, 5);
    assert.strictEqual(plan.totalImpact, 7);

    const zeroPlan = solveMaintenanceSchedule([{ TaskID: 'x', Duration: 1, Impact: 1 }], 0);
    assert.strictEqual(zeroPlan.totalImpact, 0);

    // Notification tests
    const make = (id: string, type: any, secondsAgo: number) => ({
      ID: id,
      Type: type,
      Message: `m-${id}`,
      Timestamp: new Date(Date.now() - secondsAgo * 1000).toISOString()
    });

    const items = [
      make('1', 'Result', 10),
      make('2', 'Placement', 1000),
      make('3', 'Event', 5),
      make('4', 'Placement', 2000)
    ];

    const top = getTopNotifications(items, 3);
    assert(top.length === 3, 'Top notifications should respect limit');
    assert(top[0].Type === 'Placement', 'Top item should be Placement');

    console.log('All tests passed');
    process.exit(0);
  } catch (err) {
    console.error('Tests failed:', err);
    process.exit(1);
  }
}

run();
