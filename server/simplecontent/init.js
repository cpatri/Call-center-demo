// 'use strict';

require('dotenv-safe').load();
var twilio = require('twilio');
var difference = require('lodash/difference');
var find = require('lodash/find');
var WORKSPACE_NAME = 'TaskRouter Node Workspace';
var ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

module.exports = initClient;

function initClient(existingWorkspaceSid) {
     console.log('called initClient');
    if (!existingWorkspaceSid) {
      this.client = twilio(ACCOUNT_SID, AUTH_TOKEN).taskrouter.v1.workspaces;
    }
    else {
      console.log("went to else")
      this.client = twilio(ACCOUNT_SID, AUTH_TOKEN)
      .taskrouter.v1.workspaces(existingWorkspaceSid);
      console.log("Existing workspace sid");
    }
  }


// Step 2: Create the workers
// each worker has 2 attributes: contact_url (a phone number)
// and products (a list of products each worker is specialized in)
// each worker also has an activitySid (which define the status of the worker)
// and a name for the worker
// a set of default activities are also created in the workspaces
// the Idle activity makes a worker available for incoming calls
function createWorker(opts) {
  var ctx = this;
  return this.client.activities.list({friendlyName: 'Idle'})
  .then(function(idleActivity) {
    return ctx.client.workers.create({
      friendlyName: opts.name,
      attributes: JSON.stringify({
        'products': opts.products,
        'contact_url': opts.phoneNumber,
      }),
      activitySid: idleActivity.sid,
    });
  });
}


// Step 3: Create the Task queues
// each task queue has a friendlyName and a targetWorkers (an expression to match workers)
// our 3 task queues are: SMS, Voice and Default
// SMS: targets workers specialized in Programmable SMS (like Bob ) using the expression below
// Voice: targets workers specialized in Programmable Voice (like Alice)
// Default: targets all users and can be used when there's no specialist around for the product
function createTaskQueues() {
  var ctx=this;
  return this.client.activities.list()
  .then(functions(activities) {
    var busyActivity = find(activities, {friendlyName: 'Busy'});
    var reservedActivity = find(activities, {friendlyName: 'Reserved'});

    return Promise.all([
      ctx.client.taskQueues.create({
        friendlyName: 'SMS',
        targetWorkers: 'products HAS "ProgrammableSMS"',
        assignmentActivitySid: busyActivity.sid,
        reservationActivitySid: reservedActivity.sid,
      }),
      ctx.client.taskQueues.create({
        friendlyName: 'Voice',
        targetWorkers: 'products HAS "ProgrammableVoice"',
        assignmentActivitySid: busyActivity.sid,
        reservationActivitySid: reservedActivity.sid,
      }),
      ctx.client.taskQueues.create({
        friendlyName: 'Default',
        targetWorkers: '1==1',
        assignmentActivitySid: busyActivity.sid,
        reservationActivitySid: reservedActivity.sid,
      }),
    ])
    .then(function(queues) {
      ctx.queues = queues;
    });
  });
}

function findByFriendlyName(friendlyName) {
  var client = this.client;

  return client.list()
    .then(function(data) {
      return find(data, {friendlyName: friendlyName});
    });
}

function deleteByFriendlyName(friendlyName) {
  var ctx = this;

  return this.findByFriendlyName(friendlyName)
    .then(function(workspace) {
      if (workspace.remove) {
        return workspace.remove();
      }
    });
}

//Step 1: Create the workspace:
// we delete any other workspace with the same friendlyName as the one we're trying to create
// creating a workspace requires a friendlyName and an eventCallbackUrl where a request will
// be made everytime an event is triggered in the workplace
function initWorkspace() {
  var ctx = this;
  var client = this.client;

  return ctx.findByFriendlyName(WORKSPACE_NAME)
    .then(function(workspace) {
      var newWorkspace;

      if (workspace) {
        newWorkspace= ctx.deleteByFriendlyName(WORKSPACE_NAME)
              .then(createWorkspace.bind(ctx));
      } else {
        newWorkspace = ctx.createWorkspace();
      }
      return newWorkspace;
    })
    .then(function(workspace) {
      ctx.initClient(workspace.sid);

      return workspace
    });
}
