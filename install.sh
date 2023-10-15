#!/bin/bash
# Update the package repository information
mysql_password='password'
sudo apt update

# Install MariaDB Server
sudo apt install -y mariadb-server

# Start the MariaDB service
sudo systemctl start mariadb

mysqladmin -u root password $mysql_password

# Remove anonymous users, disallow root login remotely, remove the test database, and reload privileges
mysql -u root -p$mysql_password -e "DELETE FROM mysql.user WHERE User='';"
mysql -u root -p$mysql_password -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
mysql -u root -p$mysql_password -e "DROP DATABASE IF EXISTS test;"
mysql -u root -p$mysql_password -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
mysql -u root -p$mysql_password -e "FLUSH PRIVILEGES;"

# Enable MariaDB to start on boot
sudo systemctl enable mariadb

sudo systemctl restart mariadb
echo "MariaDB installation completed!"

# Update the package repository information
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Print Node.js and npm versions
echo "Node.js version:"
node -v

echo "npm version:"
npm -v

echo "Node.js and npm installation completed!"