import http from 'http';
const port = process.env.MOCK_API_PORT || 3000;

const depots = {
  depots: [
    { ID: 1, MechanicHours: 60 },
    { ID: 2, MechanicHours: 135 },
    { ID: 3, MechanicHours: 188 },
    { ID: 4, MechanicHours: 97 },
    { ID: 5, MechanicHours: 164 }
  ]
};

const vehicles = {
  vehicles: [
    { TaskID: '264e638f-1c7a-4d67-9f9c-53f3d1766d37', Duration: 1, Impact: 5 },
    { TaskID: '73ce9dca-1536-4a7a-9f1e-c67083afad61', Duration: 6, Impact: 2 },
    { TaskID: '4b6e22ee-b4ed-45a4-a6af-5294bd069f37', Duration: 1, Impact: 3 },
    { TaskID: 'd6372f32-852b-46a9-8e8c-e730fecc3c22', Duration: 5, Impact: 5 },
    { TaskID: 'ec4b0581-bdfc-43e0-a047-871fdafe8167', Duration: 7, Impact: 3 },
    { TaskID: 'fb1e3165-67c9-4e96-a5c3-2d20085d293b', Duration: 6, Impact: 3 },
    { TaskID: '330e65c0-3815-4e10-a1ba-b93b11730308', Duration: 5, Impact: 1 },
    { TaskID: '72a91abc-4ed7-492c-9e99-348e7437953b', Duration: 5, Impact: 9 },
    { TaskID: '8a7ff5b1-335c-4a2f-96d8-09c4a262e781', Duration: 6, Impact: 10 },
    { TaskID: '8d00114-95b6-463d-ba2e-3343ec4e2e89', Duration: 6, Impact: 6 },
    { TaskID: 'a1e8b6c-1876-4a2f-b53b-5e581790033', Duration: 6, Impact: 1 },
    { TaskID: '52633541-7c5f-475a-9839-4676f8fe5fd4', Duration: 1, Impact: 5 },
    { TaskID: '9e83defa-7bb5-4a83-9e29-41716592289', Duration: 6, Impact: 9 },
    { TaskID: 'f92b0f39-35ec-47c3-a465-3e49c2218b6', Duration: 2, Impact: 5 },
    { TaskID: 'e5c8d7a8-82ef-4fcc-9d85-9b082bb85310', Duration: 5, Impact: 7 },
    { TaskID: 'e8ec2f8d-4145-4472-bce9-1de968a8d928', Duration: 1, Impact: 1 },
    { TaskID: '8a294532-c7ee-4e19-8e3d-f58b7e73e8bc', Duration: 8, Impact: 7 },
    { TaskID: '1c65e5b2-38dd-4295-e985-863f0de32c5f', Duration: 2, Impact: 9 },
    { TaskID: '43ce87a6-2b3b-42b9-9c35-deaa2c8ef5a4', Duration: 2, Impact: 3 },
    { TaskID: '0a8223fb-83c3-4722-af40-e17a7b9ee8ff', Duration: 2, Impact: 5 },
    { TaskID: '0bf75acb-1b99-4f61-59bf-dec95a7063bc', Duration: 3, Impact: 10 },
    { TaskID: 'e7165b11-1064-4db7-9d76-8ed19faf6f67', Duration: 5, Impact: 5 },
    { TaskID: 'c038ce47-ab9c-40d7-85ca-1215084f3f41', Duration: 8, Impact: 8 },
    { TaskID: '0863e52-dad5-4b78-3ab1-e55db53c8c18', Duration: 8, Impact: 5 },
    { TaskID: 'e71ddcf5-0bba-4233-bf12-c775c6456e314', Duration: 7, Impact: 10 },
    { TaskID: 'b671f7dc-db77-42bf-a7e9-8fec596c498', Duration: 7, Impact: 8 }
  ]
};

const notifications = {
  notifications: [
    { ID: 'cf288586-45ac-aba0-b54a-e69e9d4c52c8', Type: 'Result', Message: 'project-review', Timestamp: '2026-04-22T17:49:54' },
    { ID: '8a7412bd-6065-4d99-8581-837f11cc84ab', Type: 'Placement', Message: 'Advanced Micro Devices Inc. hiring', Timestamp: '2026-04-22T17:49:42' },
    { ID: 'd146095a-0d86-4a34-9e69-3900a14576bc', Type: 'Result', Message: 'mid-sem', Timestamp: '2026-04-22T17:51:30' },
    { ID: 'b283218f-ea5a-4b7c-93a9-1f2f240d64b0', Type: 'Placement', Message: 'CSX Corporation hiring', Timestamp: '2026-04-22T17:51:18' },
    { ID: '81589ada-0ad3-4f77-9554-f52fb558e09d', Type: 'Event', Message: 'farewell', Timestamp: '2026-04-22T17:51:06' },
    { ID: '0005513a-142b-4bbc-8678-eefec6e1ede', Type: 'Result', Message: 'mid-sem', Timestamp: '2026-04-22T17:50:54' },
    { ID: 'e8836726-c25e-4f21-a72f-5444acaf6a37f', Type: 'Result', Message: 'project-review', Timestamp: '2026-04-22T17:50:42' },
    { ID: '003cb427-8fcc-4f77-bb08-be228f6b04d2', Type: 'Result', Message: 'external', Timestamp: '2026-04-22T17:50:38' },
    { ID: 'e5c4f2e-31bf-4640-8f02-72fdd59859918', Type: 'Result', Message: 'project-review', Timestamp: '2026-04-22T17:50:18' },
    { ID: '1cfcc5ee-ad37-4694-8946-c7076271776a5', Type: 'Event', Message: 'tech-fest', Timestamp: '2026-04-22T17:50:06' }
  ]
};

function sendJson(res, obj) {
  const body = JSON.stringify(obj, null, 2);
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = req.url || '';

  // Friendly routes matching assignment paths
  if (url.startsWith('/evaluation-service/depots')) {
    return sendJson(res, depots);
  }

  if (url.startsWith('/evaluation-service/vehicles') || url.startsWith('/evaluation-service/vechiles')) {
    return sendJson(res, vehicles);
  }

  if (url.startsWith('/evaluation-service/notifications')) {
    return sendJson(res, notifications);
  }

  // default 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(port, () => {
  console.log(`Mock evaluation API running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('/evaluation-service/depots');
  console.log('/evaluation-service/vehicles');
  console.log('/evaluation-service/vechiles');
  console.log('/evaluation-service/notifications');
});

export {};
