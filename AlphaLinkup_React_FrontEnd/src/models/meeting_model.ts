export interface MeetingModel {
  meeting_id: string;
  requester_id: string;
  requestor_name: string;
  investor_id: string;
  investor_name: string;
  meeting_duration: string;
  meeting_type: string;
  meeting_time: string;
  meeting_date: string;
  meeting_status: string;
  status: string;
}

export const MeetingModelLabels = {
  MEETING_ID: "meeting_id",
  REQUESTER_ID: "requester_id",
  REQUESTOR_NAME: "requestor_name",
  INVESTOR_ID: "investor_id",
  INVESTOR_NAME: "investor_name",
  MEETING_DURATION: "meeting_duration",
  MEETING_TYPE: "meeting_type",
  MEETING_TIME: "meeting_time",
  MEETING_DATE: "meeting_date",
  MEETING_STATUS: "meeting_status",
  STATUS: "status",
};
