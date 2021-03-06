/*
 ~ Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~      http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 */
var appName = "bpmn-analytics-explorer";
var httpUrl = location.protocol + "//" + location.host;
var CONTEXT = "";

if (BPSTenant != undefined && BPSTenant.length > 0) {
    CONTEXT = "t/" + BPSTenant + "/jaggeryapps/" + appName;
} else {
    CONTEXT = appName;
}

/**
 * Function to set date picker to date input elements
 * @param dateElement is the element which holds the date picker
 */
function setDatePicker(dateElement) {
    var elementID = '#' + dateElement;
    $(elementID).daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'MM/DD/YYYY'
        }
    });
}

/**
 * Function to check a given String is an integer or not
 * @param param is a String value
 * @returns true if the given String value is an integer
 */
function isInteger(param) {
    return (Math.floor(param) == param && $.isNumeric(param));
}

/**
 * Function to add an input text to the select picker
 * @param selectPickerElement is a select element
 */
function selectPickerValChange(selectPickerElement) {
    var idx = selectPickerElement.options.selectedIndex;
    if (selectPickerElement.options[idx].value == 'other') {
        var other = prompt("Please indicate 'other' value:");
        if (other != '' && isInteger(other)) {
            var opt = document.createElement('option');
            opt.value = other;
            opt.innerHTML = other;
            selectPickerElement.appendChild(opt);
            $(selectPickerElement).selectpicker('val', other);
        } else {
            selectPickerElement.selectedIndex = 1;
            $(selectPickerElement).selectpicker("refresh");
        }
    }
}

function showBtnAlert(element, message) {
    if (element != null) {
        if (element.tagName == 'BUTTON') {
            alert(message);
        }
    }
}

/**
 * Function to draw Average Execution Time vs Process Id Result
 * @param renderElement is the id of the rendering section
 */
function drawAvgExecuteTimeVsProcessIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var startDate = document.getElementById("processIdAvgExecTimeStartDate");
    var startDateTemp = 0;
    if (startDate.value.length > 0) {
        startDateTemp = new Date(startDate.value).getTime();
    }

    var endDate = document.getElementById("processIdAvgExecTimeEndDate");
    var endDateTemp = 0;
    if (endDate.value.length > 0) {
        endDateTemp = new Date(endDate.value).getTime();
    }

    var body = {
        'startTime': startDateTemp,
        'endTime': endDateTemp,
        'order': $('#processIdAvgExecTimeOrder').val(),
        'count': parseInt($('#processIdAvgExecTimeCount').val())
    };

    var url = "/" + CONTEXT + "/avg_time_vs_process_id";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        data: {'filters': JSON.stringify(body)},
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                var dataset = [];
                for (var i = 0; i < dataStr.length; i++) {
                    dataset.push({
                        "yData": dataStr[i].processDefKey,
                        "xData": dataStr[i].avgExecutionTime
                    });
                }
                render(renderElementID, dataset, 'AVG Execution Time (ms)', 'Process Definition Key');
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to draw Process Instance Count vs Process Id Result
 * @param renderElement is the id of the rendering section
 */
function drawProcessInstanceCountVsProcessIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var startDate = document.getElementById("processInstanceCountProcessDefStartDate");
    var startDateTemp = 0;
    if (startDate.value.length > 0) {
        startDateTemp = new Date(startDate.value).getTime();
    }

    var endDate = document.getElementById("processInstanceCountProcessDefEndDate");
    var endDateTemp = 0;
    if (endDate.value.length > 0) {
        endDateTemp = new Date(endDate.value).getTime();
    }

    var body = {
        'startTime': startDateTemp,
        'endTime': endDateTemp,
        'order': $('#processInstanceCountProcessDefOrder').val(),
        'count': parseInt($('#processInstanceCountProcessDefCount').val())
    };

    var url = "/" + CONTEXT + "/process_instance_count_vs_process_id";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        data: {'filters': JSON.stringify(body)},
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                var dataset = [];
                for (var i = 0; i < dataStr.length; i++) {
                    dataset.push({
                        "yData": dataStr[i].processDefKey,
                        "xData": dataStr[i].processInstanceCount
                    });
                }
                render(renderElementID, dataset, 'Process Instance Count', 'Process Definition Key');
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to draw Average Execution Time Vs Process Version Result
 * @param renderElement is the id of the rendering section
 */
function drawAvgExecuteTimeVsProcessVersionResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var processKey = $('#processVersionAvgExecTimeProcessList').val();

    if (processKey != '') {
        var body = {
            'processKey': processKey,
            'order': $('#processVersionAvgExecTimeOrder').val(),
            'count': parseInt($('#processVersionAvgExecTimeCount').val())
        };

        var url = "/" + CONTEXT + "/avg_time_vs_process_version";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].processVer,
                            "xData": dataStr[i].avgExecutionTime
                        });
                    }
                    render(renderElementID, dataset, 'AVG Execution Time (ms)', 'Process Version');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty process id list.');
        showBtnAlert(currentObj, "Process id list is empty.");
    }
}

/**
 * Function to draw Process Instance Count vs Process Version Result
 * @param renderElement is the id of the rendering section
 */
function drawProcessInstanceCountVsProcessVersionResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var processKey = $('#processInstanceCountProcessVersionProcessList').val();

    if (processKey != '') {
        var body = {
            'processKey': processKey,
            'order': $('#processInstanceCountProcessVersionOrder').val(),
            'count': parseInt($('#processInstanceCountProcessVersionCount').val())
        };

        var url = "/" + CONTEXT + "/process_instance_count_vs_process_version";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].processVer,
                            "xData": dataStr[i].processInstanceCount
                        });
                    }
                    render(renderElementID, dataset, 'Process Instance Count', 'Process Version');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty process id list.');
        showBtnAlert(currentObj, "Process id list is empty.");
    }
}

/**
 * Function to draw Execution Time vs Process Instance Id Result
 * @param renderElement is the id of the rendering section
 */
function drawExecutionTimeVsProcessInstanceIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var processId = $('#processInstanceIdExecTimeProcessList').val();

    if (processId != '') {
        var startDate = document.getElementById("processInstanceIdExecTimeStartDate");
        var startDateTemp = 0;
        if (startDate.value.length > 0) {
            startDateTemp = new Date(startDate.value).getTime();
        }

        var endDate = document.getElementById("processInstanceIdExecTimeEndDate");
        var endDateTemp = 0;
        if (endDate.value.length > 0) {
            endDateTemp = new Date(endDate.value).getTime();
        }

        var body = {
            'startTime': startDateTemp,
            'endTime': endDateTemp,
            'processId': processId,
            'order': $('#processInstanceIdExecTimeOrder').val(),
            'limit': parseInt($('#processInstanceIdExecTimeLimit').val())
        };

        var url = "/" + CONTEXT + "/exec_time_vs_process_instance_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].processInstanceId,
                            "xData": dataStr[i].duration
                        });
                    }
                    render(renderElementID, dataset, 'Execution Time (ms)', 'Process Instance Id');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty process id list.');
        showBtnAlert(currentObj, "Process id list is empty.");
    }
}

/**
 * Function to draw Date vs Process Instance Count Result
 * @param renderElement is the id of the rendering section
 */
function drawDateVsProcessInstanceCountResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var startDate = document.getElementById("processInstanceCountDateStartDate");
    var startDateTemp = new Date(startDate.value).getTime();

    var endDate = document.getElementById("processInstanceCountDateEndDate");
    var endDateTemp = new Date(endDate.value).getTime();

    var processIds = $('#processInstanceCountDateProcessList').val();
    var processIdArray = [];
    if (processIds != null) {
        $('#processInstanceCountDateProcessList :selected').each(function (i, selected) {
            processIdArray[i] = $(selected).val();
        });
    }

    var body = {
        'startTime': startDateTemp,
        'endTime': endDateTemp,
        'processIdList': processIdArray
    };

    var url = "/" + CONTEXT + "/process_instance_count_vs_date";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        data: {'filters': JSON.stringify(body)},
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                var dataset = [];
                for (var i = 0; i < dataStr.length; i++) {
                    dataset.push({
                        "yData": dataStr[i].finishTime,
                        "xData": dataStr[i].processInstanceCount
                    });
                }
                render(renderElementID, dataset, 'Process Instance Count', 'Completion Date');
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to draw Average Execution Time vs Task Id Result
 * @param renderElement is the id of the rendering section
 */
function drawAvgExecuteTimeVsTaskIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var processId = $('#taskIdAvgExecTimeProcessList').val();

    if (processId != '') {
        var body = {
            'processId': processId,
            'order': $('#taskIdAvgExecTimeOrder').val(),
            'count': parseInt($('#taskIdAvgExecTimeCount').val())
        };

        var url = "/" + CONTEXT + "/avg_time_vs_task_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].taskDefId,
                            "xData": dataStr[i].avgExecutionTime
                        });
                    }
                    render(renderElementID, dataset, 'AVG Execution Time (ms)', 'Task Definition Key');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty process id list.');
        showBtnAlert(currentObj, "Process id list is empty.");
    }
}

/**
 * Function to draw Task Instance Count vs Task Id Result
 * @param renderElement is the id of the rendering section
 */
function drawTaskInstanceCountVsTaskIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var processId = $('#taskInstanceCountTaskDefProcessList').val();

    if (processId != '') {
        var body = {
            'processId': processId,
            'order': $('#taskInstanceCountTaskDefOrder').val(),
            'count': parseInt($('#taskInstanceCountTaskDefCount').val())
        };

        var url = "/" + CONTEXT + "/task_instance_count_vs_task_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].taskDefId,
                            "xData": dataStr[i].taskInstanceCount
                        });
                    }
                    render(renderElementID, dataset, 'Task Instance Count', 'Task Definition Key');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty process id list.');
        showBtnAlert(currentObj, "Process id list is empty.");
    }
}

/**
 * Function to draw Task Instance Count vs User Id Result
 * @param renderElement is the id of the rendering section
 */
function drawTaskInstanceCountVsUserIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var taskId = $('#taskInstanceCountUserIdTaskList').val();

    if (taskId != '') {
        var body = {
            'taskId': taskId,
            'order': $('#taskInstanceCountUserIdOrder').val(),
            'count': parseInt($('#taskInstanceCountUserIdCount').val())
        };

        var url = "/" + CONTEXT + "/task_instance_count_vs_user_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].assignUser,
                            "xData": dataStr[i].taskInstanceCount
                        });
                    }
                    render(renderElementID, dataset, 'Task Instance Count', 'Assignee');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty task id list.');
        showBtnAlert(currentObj, "Task id list is empty.");
    }
}

/**
 * Function to draw Average Execution Time vs User Id Result
 * @param renderElement is the id of the rendering section
 */
function drawAvgExecuteTimeVsUserIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var taskId = $('#userIdAvgExecTimeTaskList').val();

    if (taskId != '') {
        var body = {
            'taskId': taskId,
            'order': $('#userIdAvgExecTimeOrder').val(),
            'count': parseInt($('#userIdAvgExecTimeCount').val())
        };

        var url = "/" + CONTEXT + "/avg_wait_time_vs_user_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].assignUser,
                            "xData": dataStr[i].avgWaitingTime
                        });
                    }
                    render(renderElementID, dataset, 'AVG Waiting Time', 'Assignee');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty task id list.');
        showBtnAlert(currentObj, "Task id list is empty.");
    }
}

/**
 * Function to draw Execution Time vs Task Instance Id Result
 * @param renderElement is the id of the rendering section
 */
function drawExecutionTimeVsTaskInstanceIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var taskId = $('#taskInstanceIdExecTimeTaskList').val();

    if (taskId != '') {
        var startDate = document.getElementById("taskInstanceIdExecTimeStartDate");
        var startDateTemp = 0;
        if (startDate.value.length > 0) {
            startDateTemp = new Date(startDate.value).getTime();
        }

        var endDate = document.getElementById("taskInstanceIdExecTimeEndDate");
        var endDateTemp = 0;
        if (endDate.value.length > 0) {
            endDateTemp = new Date(endDate.value).getTime();
        }

        var body = {
            'startTime': startDateTemp,
            'endTime': endDateTemp,
            'taskId': taskId,
            'order': $('#taskInstanceIdExecTimeOrder').val(),
            'limit': parseInt($('#taskInstanceIdExecTimeLimit').val())
        };

        var url = "/" + CONTEXT + "/exec_time_vs_task_instance_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].taskInstanceId,
                            "xData": dataStr[i].duration
                        });
                    }
                    render(renderElementID, dataset, 'Execution Time (ms)', 'Task Instance Id');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty task id list.');
        showBtnAlert(currentObj, "Task id list is empty.");
    }
}

/**
 * Function to draw Date vs Task Instance Count Result
 * @param renderElement is the id of the rendering section
 */
function drawDateVsTaskInstanceCountResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var startDate = document.getElementById("taskInstanceCountDateStartDate");
    var startDateTemp = new Date(startDate.value).getTime();

    var endDate = document.getElementById("taskInstanceCountDateEndDate");
    var endDateTemp = new Date(endDate.value).getTime();

    var taskIds = $('#taskInstanceCountDateTaskList').val();
    var taskIdArray = [];
    if (taskIds != null) {
        $('#taskInstanceCountDateTaskList :selected').each(function (i, selected) {
            taskIdArray[i] = $(selected).val();
        });
    }

    var body = {
        'startTime': startDateTemp,
        'endTime': endDateTemp,
        'taskIdList': taskIdArray
    };

    var url = "/" + CONTEXT + "/task_instance_count_vs_date";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        data: {'filters': JSON.stringify(body)},
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                var dataset = [];
                for (var i = 0; i < dataStr.length; i++) {
                    dataset.push({
                        "yData": dataStr[i].finishTime,
                        "xData": dataStr[i].taskInstanceCount
                    });
                }
                render(renderElementID, dataset, 'Task Instance Count', 'Completion Date');
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to draw Total Involved Time vs User Id Result
 * @param renderElement is the id of the rendering section
 */
function drawTotalInvolvedTimeVsUserIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var startDate = document.getElementById("userIdTotalInvolvedTimeStartDate");
    var startDateTemp = 0;
    if (startDate.value.length > 0) {
        startDateTemp = new Date(startDate.value).getTime();
    }

    var endDate = document.getElementById("userIdTotalInvolvedTimeEndDate");
    var endDateTemp = 0;
    if (endDate.value.length > 0) {
        endDateTemp = new Date(endDate.value).getTime();
    }

    var body = {
        'startTime': startDateTemp,
        'endTime': endDateTemp,
        'order': $('#userIdTotalInvolvedTimeOrder').val(),
        'count': parseInt($('#userIdTotalInvolvedTimeCount').val())
    };

    var url = "/" + CONTEXT + "/total_involved_time_vs_user_id";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        data: {'filters': JSON.stringify(body)},
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                var dataset = [];
                for (var i = 0; i < dataStr.length; i++) {
                    dataset.push({
                        "yData": dataStr[i].assignUser,
                        "xData": dataStr[i].totalInvolvedTime
                    });
                }
                render(renderElementID, dataset, 'Total Involved Time (ms)', 'Assignee');
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to draw Total Completed Tasks vs User Id Result
 * @param renderElement is the id of the rendering section
 */
function drawTotalCompletedTasksVsUserIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var startDate = document.getElementById("userIdTotalCompletedTasksStartDate");
    var startDateTemp = 0;
    if (startDate.value.length > 0) {
        startDateTemp = new Date(startDate.value).getTime();
    }

    var endDate = document.getElementById("userIdTotalCompletedTasksEndDate");
    var endDateTemp = 0;
    if (endDate.value.length > 0) {
        endDateTemp = new Date(endDate.value).getTime();
    }

    var body = {
        'startTime': startDateTemp,
        'endTime': endDateTemp,
        'order': $('#userIdTotalCompletedTasksOrder').val(),
        'count': parseInt($('#userIdCompletedTasksCount').val())
    };

    var url = "/" + CONTEXT + "/total_completed_tasks_vs_user_id";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        data: {'filters': JSON.stringify(body)},
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                var dataset = [];
                for (var i = 0; i < dataStr.length; i++) {
                    dataset.push({
                        "yData": dataStr[i].assignUser,
                        "xData": dataStr[i].completedTotalTasks
                    });
                }
                render(renderElementID, dataset, 'Total Completed Tasks', 'Assignee');
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to draw Total Involved Time vs Process Id Result
 * @param renderElement is the id of the rendering section
 */
function drawTotalInvolvedTimeVsProcessIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var userId = $('#processIdTotalInvolvedTimeUserList').val();

    if (userId != '') {
        var startDate = document.getElementById("processIdTotalInvolvedTimeStartDate");
        var startDateTemp = 0;
        if (startDate.value.length > 0) {
            startDateTemp = new Date(startDate.value).getTime();
        }

        var endDate = document.getElementById("processIdTotalInvolvedTimeEndDate");
        var endDateTemp = 0;
        if (endDate.value.length > 0) {
            endDateTemp = new Date(endDate.value).getTime();
        }

        var body = {
            'startTime': startDateTemp,
            'endTime': endDateTemp,
            'userId': userId,
            'order': $('#processIdTotalInvolvedTimeOrder').val(),
            'count': parseInt($('#processIdTotalInvolvedTimeCount').val())
        };

        var url = "/" + CONTEXT + "/total_involved_time_vs_process_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].processDefKey,
                            "xData": dataStr[i].totalInvolvedTime
                        });
                    }
                    render(renderElementID, dataset, 'Total Involved Time (ms)', 'Process Definition Key');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty user id list.');
        showBtnAlert(currentObj, "User id list is empty.");
    }
}

/**
 * Function to draw Total Involved Instance Count vs Process Id Result
 * @param renderElement is the id of the rendering section
 */
function drawTotalInvolvedInstanceCountVsProcessIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var userId = $('#processIdTotalInvolvedInstanceCountUserList').val();

    if (userId != '') {
        var startDate = document.getElementById("processIdTotalInvolvedInstanceCountStartDate");
        var startDateTemp = 0;
        if (startDate.value.length > 0) {
            startDateTemp = new Date(startDate.value).getTime();
        }

        var endDate = document.getElementById("processIdTotalInvolvedInstanceCountEndDate");
        var endDateTemp = 0;
        if (endDate.value.length > 0) {
            endDateTemp = new Date(endDate.value).getTime();
        }

        var body = {
            'startTime': startDateTemp,
            'endTime': endDateTemp,
            'userId': userId,
            'order': $('#processIdTotalInvolvedInstanceCountOrder').val(),
            'count': parseInt($('#processIdTotalInvolvedInstanceCountCount').val())
        };

        var url = "/" + CONTEXT + "/total_involved_instance_count_vs_process_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].processDefKey,
                            "xData": dataStr[i].totalInstanceCount
                        });
                    }
                    render(renderElementID, dataset, 'Total Involved Instance Count', 'Process Definition Key');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty user id list.');
        showBtnAlert(currentObj, "User id list is empty.");
    }
}

/**
 * Function to draw User Level Task Instance Count vs Task Id Result
 * @param renderElement is the id of the rendering section
 */
function drawUserLevelTaskInstanceCountVsTaskIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var userId = $('#userLevelTaskInstanceCountTaskIdUserList').val();

    if (userId != '') {
        var body = {
            'userId': userId,
            'order': $('#userLevelTaskInstanceCountTaskIdOrder').val(),
            'count': parseInt($('#userLevelTaskInstanceCountTaskIdCount').val())
        };

        var url = "/" + CONTEXT + "/user_level_task_instance_count_vs_task_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].taskDefId,
                            "xData": dataStr[i].taskInstanceCount
                        });
                    }
                    render(renderElementID, dataset, 'Task Instance Count', 'Task Definition Key');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty process id list.');
        showBtnAlert(currentObj, "Process id list is empty.");
    }
}

/**
 * Function to draw User Level Average Execution Time Vs Task Id Result
 * @param renderElement is the id of the rendering section
 */
function drawUserLevelAvgExecuteTimeVsTaskIdResult(renderElement, currentObj) {
    var renderElementID = '#' + renderElement;
    var userId = $('#userLevelTaskIdAvgExecTimeUserList').val();

    if (userId != '') {
        var body = {
            'userId': userId,
            'order': $('#userLevelTaskIdAvgExecTimeOrder').val(),
            'count': parseInt($('#userLevelTaskIdAvgExecTimeCount').val())
        };

        var url = "/" + CONTEXT + "/user_level_avg_time_vs_task_id";
        $.ajax({
            type: 'POST',
            url: httpUrl + url,
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                var dataStr = JSON.parse(data);
                if (!$.isEmptyObject(dataStr)) {
                    var dataset = [];
                    for (var i = 0; i < dataStr.length; i++) {
                        dataset.push({
                            "yData": dataStr[i].taskDefId,
                            "xData": dataStr[i].avgExecutionTime
                        });
                    }
                    render(renderElementID, dataset, 'AVG Execution Time (ms)', 'Task Definition Key');
                }
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    } else {
        console.log('Empty user id list.');
        showBtnAlert(currentObj, "User id list is empty.");
    }
}

/**
 * Function to load the Process List
 * @param dropdownId is the id of the drop down list
 * @param barChartId is the id of the rendering element
 * @param callback is to hold a given rendering function
 */
function loadProcessList(dropdownId, barChartId, callback) {
    var dropdownElementID = '#' + dropdownId;
    var url = "/" + CONTEXT + "/process_definition_key_list";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                for (var i = 0; i < dataStr.length; i++) {
                    var opt = dataStr[i].processDefKey;
                    var el = document.createElement("option");
                    el.textContent = opt;
                    el.value = opt;
                    $(dropdownElementID).append(el);
                }
                $(dropdownElementID).selectpicker("refresh");
                if (callback != null) {
                    callback(barChartId, null);
                }
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to load the Process Key List
 * @param dropdownId is the id of the drop down list
 * @param barChartId is the id of the rendering element
 * @param callback is to hold a given rendering function
 */
function loadProcessKeyList(dropdownId, barChartId, callback) {
    var dropdownElementID = '#' + dropdownId;
    var url = "/" + CONTEXT + "/process_key_list";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                for (var i = 0; i < dataStr.length; i++) {
                    var opt = dataStr[i].processKey;
                    var el = document.createElement("option");
                    el.textContent = opt;
                    el.value = opt;
                    $(dropdownElementID).append(el);
                }
                $(dropdownElementID).selectpicker("refresh");
                if (callback != null) {
                    callback(barChartId, null);
                }
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to load the Task List
 * @param dropdownId is the id of the drop down list
 * @param barChartId is the id of the rendering element
 * @param callback is to hold a given rendering function
 */
function loadTaskList(dropdownId, barChartId, callback) {
    var dropdownElementID = '#' + dropdownId;
    var url = "/" + CONTEXT + "/task_definition_key_list";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                for (var i = 0; i < dataStr.length; i++) {
                    var opt = dataStr[i].taskDefId;
                    var el = document.createElement("option");
                    el.textContent = opt;
                    el.value = opt;
                    $(dropdownElementID).append(el);
                }
                $(dropdownElementID).selectpicker("refresh");
                if (callback != null) {
                    callback(barChartId, null);
                }
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to load the User List
 * @param dropdownId is the id of the drop down list
 * @param barChartId is the id of the rendering element
 * @param callback is to hold a given rendering function
 */
function loadUserList(dropdownId, barChartId, callback) {
    var dropdownElementID = '#' + dropdownId;
    var url = "/" + CONTEXT + "/user_id_list";
    $.ajax({
        type: 'POST',
        url: httpUrl + url,
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                for (var i = 0; i < dataStr.length; i++) {
                    var opt = dataStr[i].assignUser;
                    var el = document.createElement("option");
                    el.textContent = opt;
                    el.value = opt;
                    $(dropdownElementID).append(el);
                }
                $(dropdownElementID).selectpicker("refresh");
                if (callback != null) {
                    callback(barChartId, null);
                }
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}

/**
 * Function to load the default dates
 * @param start is to hold the start date
 * @param end is to hold the end date
 */
function loadDates(start, end) {
    var startDate = '#' + start;
    setDatePicker(end);
    var sDate = new Date();
    sDate.setMonth(sDate.getMonth() - 4);
    sDate = (sDate.getMonth() + 1) + '/' + sDate.getDate() + '/' + sDate.getFullYear();
    $(startDate).daterangepicker({
        singleDatePicker: true,
        startDate: sDate,
        showDropdowns: true,
        locale: {
            format: 'MM/DD/YYYY'
        }
    });
}

/**
 * Function to render a bar chart to the given data set
 * @param renderElementID is to hold the rendering element
 * @param dataset values are used to draw the bar chart
 * @param xTitle is the title for the x-axis
 * @param yTitle is the title for the y-axis
 */
function render(renderElementID, dataset, xTitle, yTitle) {
    // Dimensions for the chart: height, width, and space b/t the bars
    var margins = {top: 30, right: 120, bottom: 75, left: 120}
    var height = $(renderElementID).height() - margins.left - margins.right,
        width = $(renderElementID).width() - margins.top - margins.bottom,
        barPadding = 5;

    // Create a scale for the x-axis based on data
    // Domain - min and max values in the dataset (input range)
    // Range - physical range of the scale (reversed) (output range)
    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function (d) {
            return d.xData;
        })])
        .range([0, width]);

    // Implements the scale as an actual axis
    // Orient - places the axis on the left of the graph
    // Ticks - number of points on the axis, automated
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10);

    // Creates a scale for the y-axis based on ordinal/categorical values
    var yScale = d3.scale.ordinal()
        .domain(dataset.map(function (d) {
            return d.yData;
        }))
        .rangeRoundBands([height, 0]);

    // Creates an axis based off the yScale properties
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    //add tooltip
    var tooltip = d3.select(renderElementID)
        .append("div")
        .attr("class", "d3-tip");

    //tooltip.append('div')
    //    .attr('class', 'label');

    tooltip.append('div')
        .attr('class', 'contentBox');

    d3.select(renderElementID).select("svg").remove();

    // Creates the initial space for the chart
    // Select - grabs the empty <div> above this script
    // Append - places an <svg> wrapper inside the div
    // Attr - applies our height & width values from above
    var chart = d3.select(renderElementID)
        .append('svg')
        .attr('width', width + margins.left + margins.right)

        .attr('height', height + margins.top + margins.bottom)
        .append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');


    // For each value in our dataset, places and styles a bar on the chart

    // Step 1: selectAll.data.enter.append
    // Loops through the dataset and appends a rectangle for each value
    chart.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')

        // Step 2: X & Y
        // X - Places the bars in horizontal order, based on number of
        //        points & the width of the chart
        // Y - Places vertically based on scale
        .attr('x', 0)
        .attr('y', function (d) {
            return yScale(d.yData);
        })

        // Step 3: Height & Width
        // Width - Based on barpadding and number of points in dataset
        // Height - Scale using height of the chart area
        .attr('height', (height / dataset.length) - barPadding)
        .attr('width', function (d) {
            return xScale(d.xData);
        })
        .attr('fill', 'steelblue')

        // Step 4: Info for hover interaction
        .attr('class', function (d) {
            return d.yData;

        })
        .attr('id', function (d) {
            return d.xData;
        })
        .on("mouseover", function (d) {
            var matrix = this.getScreenCTM()
                .translate(this.getAttribute("x"), this.getAttribute("y"));
            tooltip.html(d.xData)
                .style("left", (window.pageXOffset + matrix.e + 15) + "px")
                .style("top", (window.pageYOffset + matrix.f - 30) + "px");
            tooltip.style('display', 'block');
        })
        .on("mouseout", function () {
            tooltip.style('display', 'none');
        });

    // Renders the yAxis once the chart is finished
    // Moves it to the left 10 pixels so it doesn't overlap
    chart.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(-10, 0)')
        .call(yAxis);

    // Appends the xAxis
    chart.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (height + 10) + ')')
        .call(xAxis);

    // Adds xAxis title
    chart.append('text')
        .text(xTitle)
        //.attr('transform', 'translate('+(width + 15)+', ' + (height + 15) + ')')
        .attr('transform', 'translate(' + (width / 2 - 50) + ', ' + (height + 50) + ')')
    ;

    // Add yAxis title
    chart.append('text')
        .text(yTitle)
        .attr('transform', 'translate(-70, -20)');

}