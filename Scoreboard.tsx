'use client'
import participantFile from './participants.json';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridInitialState,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridToolbarExport,
  GridCsvExportOptions,
  GridValidRowModel,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

import { createContext } from 'react';
import * as uuid from "uuid";

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    roundOne: 1,
    roundTwo: 1,
    roundThree: 0,
    roundFour: 0,
    roundFive: 0,
    roundSix: 0,
  },
  {
    id: randomId(),
    name: randomTraderName(),
    roundOne: 1,
    roundTwo: 1,
    roundThree: 0,
    roundFour: 0,
    roundFive: 0,
    roundSix: 0,
  },
  {
    id: randomId(),
    name: randomTraderName(),
    roundOne: 1,
    roundTwo: 1,
    roundThree: 0,
    roundFour: 0,
    roundFive: 0,
    roundSix: 0,
  },
  {
    id: randomId(),
    name: randomTraderName(),
    roundOne: 1,
    roundTwo: 1,
    roundThree: 0,
    roundFour: 0,
    roundFive: 0,
    roundSix: 0,
  },
  {
    id: randomId(),
    name: randomTraderName(),
    roundOne: 1,
    roundTwo: 1,
    roundThree: 0,
    roundFour: 0,
    roundFive: 0,
    roundSix: 0,
  },
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  theRows: GridRowsProp;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '',  roundOne: 0, roundTwo: 0, roundThree: 0, roundFour: 0, roundFive: 0, roundSix: 0,  isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer 
    className='score-keeper--header'
    >
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
      <GridToolbarExport 
        csvOptions={{
          allColumns: true,
        }}
      />
    </GridToolbarContainer>
  );
}

const jsonData = JSON.stringify(participantFile['participants']);
const participants = JSON.parse(jsonData);
const participantsRows: any[] = [];
for (let index = 0; index < participants.length; index++) {
  const element = participants[index];
  participantsRows.push({
    id: randomId(),
    name: element.name,
    roundOne: 1,
    roundTwo: 1,
    roundThree: 0,
    roundFour: 0,
    roundFive: 0,
    roundSix: 0,
    roundSeven: 0,
    roundEight: 0,
    roundNine: 0,
    roundTen: 0,
    roundEleven: 0,
    roundTwelve: 0,
    roundThirteen: 0,
    roundFourteen: 0,
    roundFifteen: 0,
  });
}
const initialRowsNew: GridRowsProp = participantsRows;

export default function FullFeaturedCrudGrid() {
  let appId = "";
  let localStorageData = null;
  if (typeof window !== 'undefined'){
    let sessionAppId = sessionStorage.getItem('scoreboard_appId');
    if (sessionAppId == null){
      appId = uuid.v4();
      sessionStorage.setItem('scoreboard_appId', appId);
    }
    else{
      appId = sessionAppId;
    }
    sessionStorage.setItem('scoreboard_appId', appId);
    localStorageData = localStorage.getItem(`scoreboard_${appId}`);
  }
  
  const storedDataParticipantsRows: GridValidRowModel[] = [];
  if (localStorageData != null) {
    const storedParticipants = JSON.parse(localStorageData)
    for (let index = 0; index < storedParticipants.length; index++) {
      const element = storedParticipants[index];
      storedDataParticipantsRows.push({
        id: element.id,
        name: element.name,
        roundOne: element.roundOne,
        roundTwo: element.roundTwo,
        roundThree: element.roundThree,
        roundFour: element.roundFour,
        roundFive: element.roundFive,
        roundSix: element.roundSix,
        roundSeven: element.roundSeven,
        roundEight: element.roundEight,
        roundNine: element.roundNine,
        roundTen: element.roundTen,
        roundEleven: element.roundEleven,
        roundTwelve: element.roundTwelve,
        roundThirteen: element.roundThirteen,
        roundFourteen: element.roundFourteen,
        roundFifteen: element.roundFifteen,
      });
    }
  }
  const initialRowsData = localStorageData ? storedDataParticipantsRows : initialRowsNew;
  const [rows, setRows] = React.useState(initialRowsData);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
    let toSaveRows = rows.filter((row) => row.id !== id);
    localStorage.setItem(`scoreboard_${appId}`, JSON.stringify(toSaveRows));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    let toSaveRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row));
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    localStorage.setItem(`scoreboard_${appId}`, JSON.stringify(toSaveRows));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleTextBoxChange = (e:any) => {
    const title = document.getElementById("scoreboard_title");
    if(title != null){
      title.textContent = 'Leaderboard - '+e.target.value;
      };
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 180, editable: true, sortable: false, headerClassName: 'score-keeper--header',},

    {
      field: 'roundOne',
      headerName: 'Round 1',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundTwo',
      headerName: 'Round 2',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundThree',
      headerName: 'Round 3',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundFour',
      headerName: 'Round 4',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundFive',
      headerName: 'Round 5',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundSix',
      headerName: 'Round 6',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundSeven',
      headerName: 'Round 7',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundEight',
      headerName: 'Round 8',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundNine',
      headerName: 'Round 9',
      type: 'number',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundTen',
      headerName: 'Round 10',
      type: 'number',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundEleven',
      headerName: 'Round 11',
      type: 'number',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundTwelve',
      headerName: 'Round 12',
      type: 'number',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundThirteen',
      headerName: 'Round 13',
      type: 'number',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundFourteen',
      headerName: 'Round 14',
      type: 'number',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'roundFifteen',
      headerName: 'Round 15',
      type: 'number',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      sortable: false,
      filterable: false,
      headerClassName: 'score-keeper--header',
    },
    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      width: 180,
      align: 'center',
      editable: false,
      sortable: true,
      headerClassName: 'score-keeper--header',
      hideSortIcons: true,
      headerAlign: 'center',
      valueGetter: (params) =>
        (params.row.roundOne +  params.row.roundTwo + params.row.roundThree + params.row.roundFour + 
          params.row.roundFive + params.row.roundSix + params.row.roundSeven + params.row.roundEight + 
          params.row.roundNine + params.row.roundTen + params.row.roundEleven + params.row.roundTwelve + 
          params.row.roundThirteen + params.row.roundFourteen + params.row.roundFifteen),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      headerClassName: 'score-keeper--header',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];  
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        '& .score-keeper--header': {
          backgroundColor: 'rgba(var(--callout-rgb), 10)',
        },
      }}
    >
      <Typography variant="h1" id='scoreboard_title' gutterBottom>
        Leaderboard
      </Typography>
      <TextField
          onChange={handleTextBoxChange}
          id="scoreboard_name_textbox"
          label="Enter Event Name"
          defaultValue=""
        />
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: 'total', sort: 'desc' }],
          },
        }}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}