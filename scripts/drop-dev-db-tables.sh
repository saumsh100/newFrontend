psql carecru_development << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO Admin;
GRANT ALL ON SCHEMA public TO public;
EOF
