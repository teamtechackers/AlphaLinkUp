import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiEye, FiMonitor } from "react-icons/fi";

import { MeetingModel, MeetingModelLabels } from "../models/meeting_model";
import { InvestorDetailModel, InvestorDetialModelLabels } from "../models/investor_detail_model";
import InvestorMeetingsDialog from "../components/InvestorMeetingsDialog";
import ImageDetailsDialog from "../components/ImageDetailsDialogProps";
import { MEETINGS_STRINGS } from "../utils/strings/pages/meetings_strings";
import { COLORS } from "../utils/theme/colors";
import { meetingsData, investorsData } from "../data/dummyData";

const MeetingsSchedulesPage: React.FC = () => {
  const [items, setItems] = useState<MeetingModel[]>(meetingsData);
  const [loading, setLoading] = useState(false);
  const [openInvestorDetails, setOpenInvestorDetails] = useState(false);
  const [openInvestorMeetings, setOpenInvestorMeetings] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetailModel | null>(null);
  const [selectedInvestorMeetings, setSelectedInvestorMeetings] = useState<MeetingModel[]>([]);

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
      {
        field: "actions",
        headerName: MEETINGS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiEye
              size={18}
              style={{ cursor: "pointer" }}
              title="View Investor Details"
              onClick={() => handleOpenInvestorDetails(params.row.investor_id)}
            />
            <FiMonitor
              size={18}
              style={{ cursor: "pointer" }}
              title="View Investor Meetings"
              onClick={() => handleOpenInvestorMeetings(params.row.investor_id)}
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
      <Box sx={{ height: 800, width: "100%" }}>
        <DataGrid rows={items} columns={columns} getRowId={(row) => row.meeting_id} loading={loading} />
      </Box>

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
                    !["investor_id", "image_url", "city_id", "state_id", "country_id"].includes(key)
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

      <InvestorMeetingsDialog
        open={openInvestorMeetings}
        onClose={() => setOpenInvestorMeetings(false)}
        meetings={selectedInvestorMeetings}
      />
    </div>
  );
};

export default MeetingsSchedulesPage;
