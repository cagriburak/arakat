import axios, { AxiosPromise, AxiosResponse } from "axios";
import Api from "../../../../../config/api/index";
import Request from "../../../../request"
import { IRowData } from "../../../../../models/databaseModels/tableOptions/tableInfo";

export const getData: (tablePath: string, columns: string, orderBy: string, limit: string, sortBy: string) => AxiosPromise<IRowData[]>
    = (tablePath, columns, orderBy, limit, sortBy) => new Request<IRowData>("", Api.BaseUrl + `get-data/${tablePath}/${columns}`).get<any>(
        {
            limit: limit,
            orderBy: orderBy,
            sortBy: sortBy
        }
    );

export const getRawData: (tablePath: string) => AxiosPromise<IRowData[]>
    = (tablePath) => new Request<IRowData>("", Api.BaseUrl + `get-raw-data/${tablePath}`).get<any>();

/* export const getData: () => AxiosPromise<ITableData>
    = () => new Request<ITableData>("", Api.MockUrl + `get-data/`).get<any>(); */
