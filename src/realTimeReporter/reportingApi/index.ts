import { itemsReporting, ItemsReportingInterface } from './itemsReporting';
import { hooksReporting, HooksReportingInterface } from './hooksReporting';
import { attachData, AttachDataInterface } from './attachData';

const ReportingApi: ItemsReportingInterface & HooksReportingInterface & AttachDataInterface = {
    ...itemsReporting,
    ...hooksReporting,
    ...attachData,
};

export default ReportingApi;
