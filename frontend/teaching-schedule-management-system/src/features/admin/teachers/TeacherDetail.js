import React from 'react';
import { useParams } from 'react-router-dom';

const TeacherDetail = () => {
  const { id } = useParams();


  return (
    <div className="teacher-detail">
      <h2>Chi tiết giảng viên</h2>
      <p>Mã giảng viên: {id}</p>
      {/* Thêm các thông tin khác ở đây sau khi có dữ liệu */}
    </div>
  );
};

export default TeacherDetail;
