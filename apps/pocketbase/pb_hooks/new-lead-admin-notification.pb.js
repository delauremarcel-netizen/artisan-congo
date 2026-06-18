/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const http = require('http');
  const https = require('https');
  
  const payload = JSON.stringify({
    templateType: 'new_lead',
    leadData: {
      id: e.record.id,
      client_name: e.record.get('client_name'),
      client_phone: e.record.get('client_phone'),
      client_email: e.record.get('client_email'),
      project_description: e.record.get('project_description'),
      category: e.record.get('category'),
      status: e.record.get('status'),
      created_date: e.record.get('created_date')
    }
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/notifications/send-email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('New lead notification sent successfully:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error sending new lead notification:', error.message);
  });

  req.write(payload);
  req.end();

  e.next();
}, 'leads');