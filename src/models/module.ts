export default interface Module {
  module_no: string;
  short_module_no: string;
  module_title: string;
  module_group: string;
  is_ip_module: boolean;
  insitute: string;
  credits: number;
  language: string;
  full_time_semester_list: Array<number>;
  part_time_semester_list: Array<number>;
}
