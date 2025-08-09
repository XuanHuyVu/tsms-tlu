import React, { useState } from 'react';
import '../../../styles/TeachingStats.css';

// Tính toán danh sách tháng đã đến (<= tháng hiện tại)
const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();
const months = [];
for (let m = 1; m <= 12; m++) {
  months.push(`Tháng ${m}/${currentYear}`);
}


const statsDataByMonth = {
  'Tháng 1/2025': {
    cards: [42, 4, 2, '65%'],
    subjects: [
      { subject: 'Lập trình phần tán', progress: 20, total: 45, percent: 44 },
      { subject: 'Công nghệ phần mềm', progress: 22, total: 45, percent: 49 }
    ]
  },
  'Tháng 2/2025': {
    cards: [45, 5, 2.2, '70%'],
    subjects: [
      { subject: 'Lập trình phần tán', progress: 22, total: 45, percent: 49 },
      { subject: 'Công nghệ phần mềm', progress: 23, total: 45, percent: 51 }
    ]
  },
  'Tháng 3/2025': {
    cards: [48, 5, 2.5, '73%'],
    subjects: [
      { subject: 'Lập trình phần tán', progress: 24, total: 45, percent: 53 },
      { subject: 'Công nghệ phần mềm', progress: 24, total: 45, percent: 53 }
    ]
  },
  'Tháng 4/2025': {
    cards: [50, 5, 2.5, '76%'],
    subjects: [
      { subject: 'Lập trình phần tán', progress: 25, total: 45, percent: 56 },
      { subject: 'Công nghệ phần mềm', progress: 26, total: 45, percent: 58 }
    ]
  },
  'Tháng 5/2025': {
    cards: [55, 5, 2.5, '80%'],
    subjects: [
      { subject: 'Lập trình phần tán', progress: 27, total: 45, percent: 60 },
      { subject: 'Công nghệ phần mềm', progress: 28, total: 45, percent: 62 }
    ]
  },
  'Tháng 6/2025': {
    cards: [58, 5, 2.5, '83%'],
    subjects: [
      { subject: 'Lập trình phần tán', progress: 30, total: 45, percent: 67 },
      { subject: 'Công nghệ phần mềm', progress: 30, total: 45, percent: 67 }
    ]
  },
  'Tháng 7/2025': {
    cards: [60, 5, 2.5, '86%'],
    subjects: [
      { subject: 'Lập trình phần tán', progress: 38, total: 45, percent: 84 },
      { subject: 'Công nghệ phần mềm', progress: 34, total: 45, percent: 76 }
    ]
  },
  'Tháng 8/2025': {},
  'Tháng 9/2025': {},
  'Tháng 10/2025': {},
  'Tháng 11/2025': {},
  'Tháng 12/2025': {}
};

const TeachingStats = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[Math.min(currentMonth, 7)-1]);
  const stats = statsDataByMonth[selectedMonth] || {};

  return (
    <div className="teaching-stats-page">
      <div className="stats-header-row">
        <label htmlFor="month-select" className="stats-header-label">Chọn tháng thống kê:</label>
        <select
          id="month-select"
          className="stats-month-select"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-value">{stats.cards ? stats.cards[0] : '-'}</div>
          <div className="stats-card-label">Giờ đã dạy</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-value">{stats.cards ? stats.cards[1] : '-'}</div>
          <div className="stats-card-label">Giờ dạy bù</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-value">{stats.cards ? stats.cards[2] : '-'}</div>
          <div className="stats-card-label">Giờ nghỉ</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-value">{stats.cards ? stats.cards[3] : '-'}</div>
          <div className="stats-card-label">Tỷ lệ hoàn thành</div>
        </div>
      </div>
      <div className="stats-section">
        <div className="stats-section-title">Thống kê theo môn học</div>
        <div className="stats-subject-list">
          {stats.subjects ? stats.subjects.map((s, idx) => (
            <div className="stats-subject-card" key={s.subject}>
              <div className="stats-subject-title">{s.subject}</div>
              <div className="stats-progress-bar-wrapper">
                <div className="stats-progress-bar-bg">
                  <div
                    className="stats-progress-bar-fg"
                    style={{ width: `${s.percent}%` }}
                  ></div>
                </div>
                <div className="stats-progress-percent">{s.percent}%</div>
              </div>
              <div className="stats-progress-label">{s.progress}/{s.total} tiết</div>
            </div>
          )) : <div style={{color:'#888',fontStyle:'italic'}}>Không có dữ liệu</div>}
        </div>
      </div>
    </div>
  );
};

export default TeachingStats;
