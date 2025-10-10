import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { MeetingModel, MeetingModelLabels } from "../models/meeting_model";
import { MEETINGS_STRINGS } from "../utils/strings/pages/meetings_strings";
import { COLORS } from "../utils/theme/colors";

interface InvestorMeetingsDialogProps {
  open: boolean;
  onClose: () => void;
  meetings: MeetingModel[];
}

const InvestorMeetingsDialog: React.FC<InvestorMeetingsDialogProps> = ({ open, onClose, meetings }) => {
  const columns = useMemo(
    () => [
      { field: MeetingModelLabels.MEETING_ID, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_ID, width: 120 },
      { field: MeetingModelLabels.REQUESTOR_NAME, headerName: MEETINGS_STRINGS.TABLE.HEADER_REQUESTOR_NAME, width: 180 },
      { field: MeetingModelLabels.INVESTOR_NAME, headerName: MEETINGS_STRINGS.TABLE.HEADER_INVESTOR_NAME, width: 180 },
      { field: MeetingModelLabels.MEETING_DURATION, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_DURATION, width: 120 },
      { field: MeetingModelLabels.MEETING_TYPE, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_TYPE, width: 120 },
      { field: MeetingModelLabels.MEETING_TIME, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_TIME, width: 120 },
      { field: MeetingModelLabels.MEETING_DATE, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_DATE, width: 140 },
      { field: MeetingModelLabels.MEETING_STATUS, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_STATUS, width: 140 },
      {
        field: MeetingModelLabels.STATUS,
        headerName: MEETINGS_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span style={{ color: params.value === "1" ? COLORS.green : COLORS.red, fontWeight: 500 }}>
            {params.value === "1" ? MEETINGS_STRINGS.TABLE.STATUS_ACTIVE : MEETINGS_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "70%",
          maxWidth: "none",
        },
      }}
    >
      <div className="p-3">
        <h5 className="mb-3">{MEETINGS_STRINGS.DIALOGS.INVESTOR_MEETINGS_TITLE}</h5>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid rows={meetings} columns={columns} getRowId={(row) => row.meeting_id} />
        </Box>
      </div>
    </Dialog>
  );
};

export default InvestorMeetingsDialog;
