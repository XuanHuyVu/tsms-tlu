CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL UNIQUE,
    password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    email VARCHAR(100) CHARACTER SET utf8mb4 UNIQUE,
    role ENUM('Sinh viên', 'Giáo viên', 'Quản trị viên') CHARACTER SET utf8mb4 NOT NULL
);

CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    student_code VARCHAR(20) CHARACTER SET utf8mb4 NOT NULL UNIQUE,
    full_name VARCHAR(100) CHARACTER SET utf8mb4,
    class_name VARCHAR(50) CHARACTER SET utf8mb4,
    enrollment_year INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE teachers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    teacher_code VARCHAR(20) CHARACTER SET utf8mb4 NOT NULL UNIQUE,
    full_name VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    gender ENUM('NAM', 'NỮ', 'KHÁC'),
    date_of_birth DATE,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    department VARCHAR(100) CHARACTER SET utf8mb4,
    status ENUM('ĐANG_LÀM', 'NGHỈ_PHÉP', 'NGHỈ_VIỆC') DEFAULT 'ĐANG_LÀM',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE subjects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    description TEXT,
    department VARCHAR(100),
    semester VARCHAR(20),
    type ENUM('Bắt buộc', 'Tự chọn', 'Đại cương') CHARACTER SET utf8mb4 NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE semesters (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    term ENUM('1', '2', 'Hè') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Đang diễn ra', 'Chưa bắt đầu', 'Kết thúc') DEFAULT 'Chưa bắt đầu' CHARACTER SET utf8mb4 NOT NULL
);

CREATE TABLE class_sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    room VARCHAR(50) CHARACTER SET utf8mb4,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE teaching_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    teacher_id BIGINT,
    subject_id BIGINT,
    class_section_id BIGINT,
    semester_id BIGINT,
    note TEXT CHARACTER SET utf8mb4,
    status ENUM('CHỜ_DUYỆT', 'ĐÃ_DUYỆT', 'ĐÃ_HUỶ') DEFAULT 'CHỜ_DUYỆT',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (class_section_id) REFERENCES class_sections(id),
    FOREIGN KEY (semester_id) REFERENCES semesters(id)
);

CREATE TABLE teaching_schedule_detail (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT,
    day_of_week ENUM('Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ Nhật') CHARACTER SET utf8mb4 NOT NULL,
    period INT,
    duration INT,
    type ENUM('Lý Thuyết', 'Thực Hành') CHARACTER SET utf8mb4 NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES teaching_schedules(id)
);

CREATE TABLE schedule_changes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    teaching_schedule_id BIGINT NOT NULL,
    type ENUM('HỦY', 'BÙ') CHARACTER SET utf8mb4 NOT NULL,
    new_date DATE,
    new_room VARCHAR(50) CHARACTER SET utf8mb4,
    reason VARCHAR(255) CHARACTER SET utf8mb4,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teaching_schedule_id) REFERENCES teaching_schedules(id)
);

CREATE TABLE teaching_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    teaching_schedule_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    actual_date DATE NOT NULL,
    status ENUM('HOÀN THÀNH', 'ĐÃ HỦY', 'BÙ') CHARACTER SET utf8mb4 NOT NULL,
    note VARCHAR(255) CHARACTER SET utf8mb4,
    FOREIGN KEY (teaching_schedule_id) REFERENCES teaching_schedules(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE student_class_sections (
    student_id BIGINT,
    class_section_id BIGINT,
    practise_group VARCHAR(10) CHARACTER SET utf8mb4,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, class_section_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_section_id) REFERENCES class_sections(id)
);
