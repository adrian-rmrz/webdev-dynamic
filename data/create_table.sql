CREATE TABLE IF NOT EXISTS RelationshipStatus (
    status_id TEXT PRIMARY KEY,
    status_type TEXT
);

CREATE TABLE IF NOT EXISTS Duration (
    duration_id INTEGER PRIMARY KEY,
    duration_length TEXT
);

CREATE TABLE IF NOT EXISTS SeparateBed (
    sepbed_id TEXT PRIMARY KEY, 
    sepbed_type TEXT
);

CREATE TABLE IF NOT EXISTS YourSleepLocation (
    yloc_id TEXT PRIMARY KEY, 
    yloc_type TEXT
);

CREATE TABLE IF NOT EXISTS PartnerSleepLocation (
    ploc_id TEXT PRIMARY KEY, 
    ploc_type TEXT
);

CREATE TABLE IF NOT EXISTS DoesSnore (
    snore_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS FrequentBathroom (
    bath_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS IsSick (
    sick_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS Intimate (
    intim_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS DifferentTemp (
    temp_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS Argument (
    arg_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS NoSpace (
    space_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS NoShareSheets (
    sheet_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS SleepChild (
    child_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS NightWork (
    work_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS OtherOption (
    other_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS StayTogether (
    stay_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS SleepBetter (
    better_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS SexLife (
    sex_id INTEGER PRIMARY KEY, 
    answer TEXT
);

CREATE TABLE IF NOT EXISTS Occupation (
    job_id TEXT PRIMARY KEY, 
    job TEXT
);

CREATE TABLE IF NOT EXISTS Gender (
    gender_id TEXT PRIMARY KEY,
    gender_type TEXT
);

CREATE TABLE IF NOT EXISTS Age (
    age_id INTEGER PRIMARY KEY, 
    age_range TEXT
);

CREATE TABLE IF NOT EXISTS Income (
    income_id INTEGER PRIMARY KEY, 
    income_range TEXT
);

CREATE TABLE IF NOT EXISTS Education (
    degree_id TEXT PRIMARY KEY, 
    degree TEXT
);

CREATE TABLE IF NOT EXISTS Location (
    location_id TEXT PRIMARY KEY, 
    location TEXT
);

CREATE TABLE IF NOT EXISTS Sleep (
    id INTEGER PRIMARY KEY,
    status_id TEXT,
    duration_id INTEGER,
    sepbed_id TEXT,
    yloc_id TEXT,
    ploc_id TEXT,
    snore_id INTEGER,
    bath_id INTEGER,
    sick_id INTEGER,
    intim_id INTEGER,
    temp_id INTEGER,
    arg_id INTEGER,
    space_id INTEGER,
    sheet_id INTEGER,
    child_id INTEGER,
    work_id INTEGER,
    other_id INTEGER,
    stay_id INTEGER,
    better_id INTEGER,
    sex_id INTEGER,
    job_id TEXT,
    gender_id TEXT,
    age_id INTEGER,
    income_id INTEGER,
    degree_id TEXT,
    location_id TEXT,
    FOREIGN KEY (status_id) REFERENCES RelationshipStatus(status_id),
    FOREIGN KEY (duration_id) REFERENCES Duration(duration_id),
    FOREIGN KEY (sepbed_id) REFERENCES SeparateBed(sepbed_id),
    FOREIGN KEY (yloc_id) REFERENCES YourSleepLocation(yloc_id),
    FOREIGN KEY (ploc_id) REFERENCES PartnerSleepLocation(ploc_id),
    FOREIGN KEY (snore_id) REFERENCES DoesSnore(snore_id),
    FOREIGN KEY (bath_id) REFERENCES FrequentBathroom(bath_id),
    FOREIGN KEY (sick_id) REFERENCES IsSick(sick_id),
    FOREIGN KEY (intim_id) REFERENCES Intimate(intim_id),
    FOREIGN KEY (temp_id) REFERENCES DifferentTemp(temp_id),
    FOREIGN KEY (arg_id) REFERENCES Argument(arg_id),
    FOREIGN KEY (space_id) REFERENCES NoSpace(space_id),
    FOREIGN KEY (sheet_id) REFERENCES NoShareSheets(sheet_id),
    FOREIGN KEY (child_id) REFERENCES SleepChild(child_id),
    FOREIGN KEY (work_id) REFERENCES NightWork(work_id),
    FOREIGN KEY (other_id) REFERENCES OtherOption(other_id),
    FOREIGN KEY (stay_id) REFERENCES StayTogether(stay_id),
    FOREIGN KEY (better_id) REFERENCES SleepBetter(better_id),
    FOREIGN KEY (sex_id) REFERENCES SexLife(sex_id),
    FOREIGN KEY (job_id) REFERENCES Occupation(job_id),
    FOREIGN KEY (gender_id) REFERENCES Gender(gender_id),
    FOREIGN KEY (age_id) REFERENCES Age(age_id),
    FOREIGN KEY (income_id) REFERENCES Income(income_id),
    FOREIGN KEY (degree_id) REFERENCES Education(degree_id),
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
);


INSERT INTO Gender (gender_id, gender_type) VALUES
    ('F', 'Female'),
    ('M', 'Male'),
    ('O', 'Prefer not to say');

INSERT INTO Age (age_id, age_range) VALUES
    (18, '18-29'),
    (30, '30-44'),
    (45, '45-60'),
    (61, '> 60'),
    (0, 'Prefer not to say');

INSERT INTO Income (income_id, income_range) VALUES
    (0, '$0 - $24,999'),
    (1, '$25,000 - $49,999'),
    (2, '$50,000 - $99,999'),
    (3, '$100,000 - $149,999'),
    (4, '$150,000+'),
    (5, 'Prefer not to say');

INSERT INTO Education (degree_id, degree) VALUES
    ('HS', 'High School Diploma'),
    ('LT', 'Less than High School'),
    ('AD', 'Some College or Associate Degree'),
    ('BA', 'Bachelor''s Degree'),
    ('GD', 'Graduate Degree'),
    ('OT', 'Other');

INSERT INTO Location (location_id, location) VALUES
    ('ENC', 'East North Central'),
    ('ESC', 'East South Central'),
    ('MA', 'Mid-Atlantic'),
    ('MT', 'Mountain'),
    ('NE', 'New England'),
    ('PAC', 'Pacific'),
    ('SA', 'South Atlantic'),
    ('WNC', 'West North Central'),
    ('WSC', 'West South Central'),
    ('P', 'Prefer not to say');

INSERT INTO Occupation (job_id, job) VALUES
    ('AE', 'Architecture and Engineering Occupations'),
    ('AD', 'Arts, Design, Entertainment, Sports, and Media Occupations'),
    ('BC', 'Building and Grounds Cleaning and Maintenance Occupations'),
    ('BS', 'Business and Financial Operations Occupations'),
    ('CC', 'Community and Social Service Occupations'),
    ('CM', 'Computer and Mathematical Occupations'),
    ('CO', 'Construction and Extraction Occupations'),
    ('ED', 'Education, Training, and Library Occupations'),
    ('FF', 'Farming, Fishing, and Forestry Occupations'),
    ('FO', 'Food Preparation and Serving Related Occupations'),
    ('HC', 'Healthcare Practitioners and Technical Occupations'),
    ('HS', 'Healthcare Support Occupations'),
    ('IS', 'Installation, Maintenance, and Repair Occupations'),
    ('LF', 'Legal Occupations'),
    ('LS', 'Life, Physical, and Social Science Occupations'),
    ('MA', 'Management Occupations'),
    ('PC', 'Personal Care and Service Occupations'),
    ('PR', 'Production Occupations'),
    ('PS', 'Protective Service Occupations'),
    ('SA', 'Sales and Related Occupations'),
    ('TR', 'Transportation and Material Moving Occupations'),
    ('OF', 'Office and Administrative Support Occupations'),
    ('OT', 'Other'),
    ('NO', 'No answer');

INSERT INTO SexLife (sex_id, answer) VALUES
    (0, 'Strongly disagree'),
    (1, 'Somewhat disagree'),
    (2, 'Neither agree nor disagree'),
    (3, 'Somewhat agree'),
    (4, 'Strongly agree'),
    (5, 'No answer');

INSERT INTO SleepBetter (better_id, answer) VALUES
    (0, 'Strongly disagree'),
    (1, 'Somewhat disagree'),
    (2, 'Neither agree nor disagree'),
    (3, 'Somewhat agree'),
    (4, 'Strongly agree'),
    (5, 'No answer');

INSERT INTO StayTogether (stay_id, answer) VALUES
    (0, 'Strongly disagree'),
    (1, 'Somewhat disagree'),
    (2, 'Neither agree nor disagree'),
    (3, 'Somewhat agree'),
    (4, 'Strongly agree'),
    (5, 'No answer');

INSERT INTO RelationshipStatus (status_id, status_type) VALUES
    ('SC', 'Single, but cohabiting with a significant other'),
    ('DP', 'In a domestic partnership or civil union'),
    ('MM', 'Married'), 
    ('DV', 'Divorced'),
    ('SP', 'Separated'),
    ('WD', 'Widowed');

INSERT INTO Duration (duration_id, duration_length) VALUES
    (1, 'Less than 1 year'),
    (5, '1-5 years'),
    (10, '6-10 years'), 
    (15, '11-15 years'), 
    (20, '16-20 years'), 
    (25, 'More than 20 years'), 
    (0, 'Prefer not to say');

INSERT INTO SeparateBed (sepbed_id, sepbed_type) VALUES 
    ('N', 'Never'), 
    ('Y', 'Once a year or less'), 
    ('M', 'Once a month or less'), 
    ('MM', 'A few times per month'), 
    ('W', 'A few times per week'), 
    ('D', 'Every night'),
    ('NA', 'N/A'),
    ('NO', 'No answer');

INSERT INTO YourSleepLocation (yloc_id, yloc_type) VALUES
    ('DB', 'Shared bedroom, different bed'),
    ('SF', 'Shared bedroom, but one of us sleeps on the floor'),
    ('SB', 'Separate bedroom'),
    ('OC', 'On the couch/chair'),
    ('PSE', 'I sleep in our shared bed, my partner sleeps elsewhere'),
    ('O', 'Other'),
    ('NA', 'N/A'),
    ('NO', 'No answer');

INSERT INTO PartnerSleepLocation (ploc_id, ploc_type) VALUES
    ('PSB', 'My partner sleeps in our shared bed, I sleep elsewhere'),
    ('DB', 'Shared bedroom, different bed'),
    ('SF', 'Shared bedroom, but one of us sleeps on the floor'),
    ('SB', 'Separate bedroom'),
    ('OC', 'On the couch/chair'),
    ('Other', 'Other'),
    ('NA', 'N/A'),
    ('NO', 'No answer');

INSERT INTO DoesSnore (snore_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO FrequentBathroom (bath_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO OtherOption (other_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO NightWork (work_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO SleepChild (child_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO NoShareSheets (sheet_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO NoSpace (space_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO Argument (arg_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO DifferentTemp (temp_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO Intimate (intim_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');

INSERT INTO IsSick (sick_id, answer) VALUES
    (0, 'No'),
    (1, 'Yes');
