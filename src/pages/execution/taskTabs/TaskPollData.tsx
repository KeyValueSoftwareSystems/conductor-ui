import React from "react";
import { KeyValueTable, LinearProgress } from "../../../components";
import { usePollData, useQueueSize } from "../../../data/task";
import _ from "lodash";
import { timestampRenderer } from "../../../utils/helpers";
import { TaskSelection } from "../tabLoader";
import Blank from "../../../components/NoTaskSelected";
import Alert from "@mui/material/Alert";

export default function TaskPollData({
  taskSelection,
}: {
  taskSelection?: TaskSelection;
}) {
  const { data: pollData, isLoading: isLoadingPollData } = usePollData(
    taskSelection?.taskConfig.name,
  );
  const { data: queueSize, isLoading: isLoadingQueueSize } = useQueueSize(
    taskSelection?.taskConfig.name,
    taskSelection?.taskResult?.domain,
  );

  if (!taskSelection) {
    return <Blank />;
  }

  const { taskConfig } = taskSelection;

  const pollDataRow = pollData?.find((row: any) => {
    if (taskSelection?.taskResult?.domain) {
      return row.domain === taskSelection?.taskResult.domain;
    } else {
      return _.isUndefined(row.domain);
    }
  });

  const data = [
    { label: "Task Name", value: taskConfig.name },
    {
      label: "Domain",
      value: _.defaultTo(taskSelection?.taskResult?.domain, "(No Domain Set)"),
    },
  ];

  if (pollDataRow) {
    data.push({
      label: "Last Polled By Worker",
      value: pollDataRow.workerId,
    });
    data.push({
      label: "Last Poll Time",
      value: timestampRenderer(pollDataRow.lastPollTime) || "",
    });
  }
  if (queueSize !== undefined) {
    data.push({
      label: "Current Queue Size",
      value: queueSize,
    });
  }

  return (
    <>
      <div style={{ margin: "15px" }}>
        <Alert severity="info">
          This task was last polled by this worker for this Task Name, but not
          necessarily this task instance.
          <br />
          The Domain of the selected task is used to filter its polling status.
          It is NOT the status of the poll over all domains.
        </Alert>
      </div>
      <KeyValueTable
        data={data}
        loading={isLoadingPollData || isLoadingQueueSize}
      />
    </>
  );
}
