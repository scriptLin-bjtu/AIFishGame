import { DatePicker, message } from "antd";
import moment from "moment";
import { useState, useMemo, useEffect } from "react";

const { RangePicker } = DatePicker;

function TimeRangeBar() {
    const MAX_RANGE_YEARS = 3;
    const MAX_GAP_MONTHS = 3;

    const today = moment().endOf("day");
    const minGlobalDate = moment()
        .subtract(MAX_RANGE_YEARS, "year")
        .startOf("day");

    // 日历中间态（控制 disabledDate）
    const [calendarDates, setCalendarDates] = useState([null, null]);
    // Picker UI 的值（初始不选中）
    const [value, setValue] = useState([null, null]);
    // 当前用于「请求」的时间范围
    const [requestRange, setRequestRange] = useState(null);

    /**
     * 请求用时间归一化（闭区间）
     */
    const normalizeRangeForRequest = ([start, end]) => [
        start.clone().startOf("day"),
        end.clone().endOf("day"),
    ];

    /**
     * 模拟网络请求
     */
    const mockFetch = (range) => {
        if (!range) return;

        const [start, end] = normalizeRangeForRequest(range);

        console.log("📡 触发网络请求");
        console.log("开始时间戳:", start.valueOf()); // number, ms
        console.log("结束时间戳:", end.valueOf()); // number, ms
    };

    /**
     * 初次加载：默认最近 7 天（UI 不选中）
     */
    useEffect(() => {
        const end = moment().endOf("day");
        const start = moment().subtract(7, "day").startOf("day");
        setRequestRange([start, end]);
    }, []);

    /**
     * 监听请求时间变化
     */
    useEffect(() => {
        if (requestRange) {
            mockFetch(requestRange);
        }
    }, [requestRange]);

    /**
     * 动态禁用日期
     */
    const disabledDate = useMemo(() => {
        return (current) => {
            if (!current) return false;

            if (current.isAfter(today)) return true;
            if (current.isBefore(minGlobalDate)) return true;

            const [start, end] = calendarDates;

            // 已选开始时间
            if (start && !end) {
                const maxEnd = start.clone().add(MAX_GAP_MONTHS, "month");
                const realMaxEnd = maxEnd.isAfter(today) ? today : maxEnd;

                return (
                    current.isBefore(start, "day") ||
                    current.isAfter(realMaxEnd, "day")
                );
            }

            // 已选结束时间
            if (!start && end) {
                const minStart = end.clone().subtract(MAX_GAP_MONTHS, "month");
                const realMinStart = minStart.isBefore(minGlobalDate)
                    ? minGlobalDate
                    : minStart;

                return (
                    current.isBefore(realMinStart, "day") ||
                    current.isAfter(end, "day")
                );
            }

            return false;
        };
    }, [calendarDates, today, minGlobalDate]);

    /**
     * 日历面板变化（关键）
     */
    const handleCalendarChange = (dates) => {
        setCalendarDates(dates || [null, null]);
    };

    /**
     * 用户确认选择
     */
    const handleChange = (dates) => {
        if (!dates || !dates[0] || !dates[1]) {
            setValue([null, null]);
            return;
        }

        const [start, end] = dates;
        const diffMonths = end.diff(start, "month", true);

        if (diffMonths > MAX_GAP_MONTHS) {
            message.warning(`时间范围不能超过 ${MAX_GAP_MONTHS} 个月`);
            return;
        }

        // 更新 UI
        setValue(dates);
        // 更新请求时间
        setRequestRange(dates);
    };

    return (
        <RangePicker
            value={value}
            disabledDate={disabledDate}
            onCalendarChange={handleCalendarChange}
            onChange={handleChange}
            format="YYYY-MM-DD"
            placeholder={["开始日期", "结束日期"]}
            style={{ width: "100%" }}
        />
    );
}

export default TimeRangeBar;
