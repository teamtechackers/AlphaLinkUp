import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiMonitor, FiEdit } from "react-icons/fi";
import { UserModel } from "../models/user_model";
import { MeetingModel, MeetingModelLabels } from "../models/meeting_model";
import { InvestorDetailModel } from "../models/investor_detail_model";
import InvestorMeetingsDialog from "../components/InvestorMeetingsDialog";
import ImageDetailsDialog from "../components/ImageDetailsDialogProps";
import { MEETINGS_STRINGS } from "../utils/strings/pages/meetings_strings";
import { COLORS } from "../utils/theme/colors";
import { meetingsData, investorsData, usersData  } from "../data/dummyData";

const MeetingsSchedulesPage: React.FC = () => {
  const [items, setItems] = useState<MeetingModel[]>(meetingsData);
  const [loading, setLoading] = useState(false);
  const [openInvestorDetails, setOpenInvestorDetails] = useState(false);
  const [openInvestorMeetings, setOpenInvestorMeetings] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetailModel | null>(null);
  const [selectedInvestorMeetings, setSelectedInvestorMeetings] = useState<MeetingModel[]>([]);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingModel | null>(null);

  const handleOpenInvestorDetails = (investorId: string) => {
    const investor = investorsData.find((i) => i.investor_id === investorId) || null;
    setSelectedInvestor(investor);
    setOpenInvestorDetails(true);
  };

  const handleOpenInvestorMeetings = (investorId: string) => {
    const meetings = items.filter((m) => m.investor_id === investorId);
    setSelectedInvestorMeetings(meetings);
    setOpenInvestorMeetings(true);
  };

  const handleOpenUserDetails = (userId: string) => {
    const cleanId = userId.replace("U-", "");
    const user = usersData.find((u) => u.user_id.toString() === cleanId) || null;
    setSelectedUser(user);
    setOpenUserDetails(true);
  };

  const onEdit = (item: MeetingModel) => {
    setSelectedMeeting(item);
  };

  const handleReset = () => {
    setSelectedMeeting(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedMeeting) return;
    const { name, value } = e.target;
    setSelectedMeeting((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const formatTimeForInput = (timeString: string) => {
    if (!timeString) return "";
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const columns = useMemo(
    () => [
      { field: MeetingModelLabels.MEETING_ID, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_ID, width: 120 },
      {
        field: MeetingModelLabels.REQUESTOR_NAME,
        headerName: MEETINGS_STRINGS.TABLE.HEADER_REQUESTOR_NAME,
        width: 180,
        renderCell: (params: any) => (
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleOpenUserDetails(params.row.requester_id)}
          >
            {params.row.requestor_name}
          </span>
        ),
      },
      { 
        field: MeetingModelLabels.INVESTOR_NAME,
         headerName: MEETINGS_STRINGS.TABLE.HEADER_INVESTOR_NAME,
          width: 180,
          renderCell: (params: any) => (
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => handleOpenInvestorDetails(params.row.investor_id)}
            >
              {params.row.investor_name}
            </span>
          ),
      },
      { field: MeetingModelLabels.MEETING_DURATION, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_DURATION, width: 120 },
      { field: MeetingModelLabels.MEETING_TYPE, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_TYPE, width: 120 },
      { field: MeetingModelLabels.MEETING_TIME, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_TIME, width: 120 },
      { field: MeetingModelLabels.MEETING_DATE, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_DATE, width: 140 },
      { field: MeetingModelLabels.MEETING_STATUS, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_STATUS, width: 140 },
      {
        field: "actions",
        headerName: MEETINGS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiMonitor
              size={18}
              style={{ cursor: "pointer" }}
              title="View Investor Meetings"
              onClick={() => handleOpenInvestorMeetings(params.row.investor_id)}
            />
            <FiEdit
              className="icon-hover"
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => onEdit(params.row)}
            />
          </div>
        ),
      },
    ],
    [items]
  );

  return (
    <div className="container-fluid" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{MEETINGS_STRINGS.TITLE}</h4>

      <div className="row">

        <div className="col-lg-8">
          <Box sx={{ height: 800, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              getRowId={(row) => row.meeting_id}
              loading={loading}
            />
          </Box>
        </div>

        <div className="col-lg-4">
          <div
            className="card p-4 shadow-sm"
            style={{ borderRadius: "12px", backgroundColor: COLORS.white }}
          >
            <h5 className="mb-4">Edit Meeting</h5>

            <form>
              {/* Requestor Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_REQUESTOR_NAME}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedMeeting?.requestor_name || ""}
                  placeholder="(Auto-filled)"
                  disabled
                />
              </div>

              {/* Investor Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_INVESTOR_NAME}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedMeeting?.investor_name || ""}
                  placeholder="(Auto-filled)"
                  disabled
                />
              </div>

              {/* Duration */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_DURATION}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedMeeting?.meeting_duration || ""}
                  placeholder="(Auto-filled)"
                  disabled
                />
              </div>

              {/* Type */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_TYPE}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedMeeting?.meeting_type || ""}
                  placeholder="(Auto-filled)"
                  disabled
                />
              </div>

              <hr className="my-4" />

              {/* Time */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_TIME}
                </label>
                <input
                  type="time"
                  className="form-control"
                  name="meeting_time"
                  value={selectedMeeting ? formatTimeForInput(selectedMeeting.meeting_time) : ""}
                  onChange={handleChange}
                />
              </div>

              {/* Date */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_DATE}
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="meeting_date"
                  value={selectedMeeting?.meeting_date || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Meeting Status */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_STATUS}
                </label>
                <select
                  className="form-select"
                  name="meeting_status"
                  value={selectedMeeting?.meeting_status || ""}
                  onChange={handleChange}
                >
                  <option value="">{`Select ${MEETINGS_STRINGS.TABLE.HEADER_MEETING_STATUS}`}</option>
                  <option value={MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_REQUEST_PENDING}>
                   {MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_REQUEST_PENDING} </option>
                  <option value={MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_SCHEDULED}>
                    {MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_SCHEDULED} </option>
                  <option value={MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_COMPLETED}>
                    {MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_COMPLETED} </option>
                  <option value={MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_MISSED}>
                   {MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_MISSED} </option>
                  <option value={MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_CANCELLED}>
                       {MEETINGS_STRINGS.FORM.FIELD_LABELS.MEETING_STATUSES.STATUS_CANCELLED} </option>
                </select>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button type="submit" className="btn btn-primary" disabled>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ImageDetailsDialog
        open={openInvestorDetails}
        onClose={() => setOpenInvestorDetails(false)}
        title="Investor Details"
        imageUrl={selectedInvestor?.image_url}
        fields={
          selectedInvestor
            ? Object.keys(selectedInvestor)
                .filter(
                  (key) =>
                    !["profile_photo", "investor_id", "image_url", "city_id", "state_id", "country_id"].includes(key)
                )
                .map((key) => ({
                  label: key.replace(/_/g, " ").toUpperCase(),
                  value:
                    key === "status"
                      ? selectedInvestor.status === "1"
                        ? "Active"
                        : "Inactive"
                      : (selectedInvestor as any)[key],
                }))
            : []
        }
      />

      <ImageDetailsDialog
        open={openUserDetails}
        onClose={() => setOpenUserDetails(false)}
        title="Requester Details"
        imageUrl={selectedUser?.profile_photo || ""}
        fields={
          selectedUser
            ? Object.keys(selectedUser)
                .filter(
                  (key) =>
                    !["profile_photo", "country_id", "state_id", "city_id", "user_id"].includes(key)
                )
                .map((key) => ({
                  label: key.replace(/_/g, " ").toUpperCase(),
                  value:
                    key === "status"
                      ? selectedUser.status
                      : (selectedUser as any)[key],
                }))
            : []
        }
      />

      <InvestorMeetingsDialog
        open={openInvestorMeetings}
        onClose={() => setOpenInvestorMeetings(false)}
        meetings={selectedInvestorMeetings}
      />
    </div>
  );

};

export default MeetingsSchedulesPage;
