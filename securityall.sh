📜 Security Audit & Hardening Script (Linux)

Save this script as security_audit.sh, then run:

chmod +x security_audit.sh
sudo ./security_audit.sh

#!/bin/bash

echo "🔍 Starting Security Audit and Hardening Script..."
echo "--------------------------------------------------"
LOGFILE="security_audit.log"

# Function to log and display output
log() {
    echo -e "$1" | tee -a "$LOGFILE"
}

# 🔹 Check for SUID and SGID binaries (Privilege Escalation Risks)
log "\n🔎 Checking for SUID & SGID binaries..."
find / -perm -4000 -type f 2>/dev/null | tee -a "$LOGFILE"
find / -perm -2000 -type f 2>/dev/null | tee -a "$LOGFILE"

# 🔹 Find world-writable files (Weak File Permissions)
log "\n🔎 Checking for world-writable files..."
find / -type f -perm -o+w 2>/dev/null | tee -a "$LOGFILE"

# 🔹 Find world-writable directories
log "\n🔎 Checking for world-writable directories..."
find / -type d -perm -o+w 2>/dev/null | tee -a "$LOGFILE"

# 🔹 Check sudo permissions
log "\n🔎 Checking sudo privileges..."
sudo -l | tee -a "$LOGFILE"

# 🔹 Check for unauthorized sudo users
log "\n🔎 Checking sudoers file for weak configurations..."
grep -i "ALL=(ALL) NOPASSWD" /etc/sudoers 2>/dev/null | tee -a "$LOGFILE"

# 🔹 Check open ports
log "\n🔎 Checking open ports..."
ss -tulnp | tee -a "$LOGFILE"

# 🔹 List users with root privileges
log "\n🔎 Checking users with sudo/root access..."
getent group sudo | tee -a "$LOGFILE"
getent group wheel | tee -a "$LOGFILE"

# 🔹 Find files owned by root in user home directories
log "\n🔎 Checking for root-owned files in user home directories..."
find /home -user root 2>/dev/null | tee -a "$LOGFILE"

# 🔹 Scan for unauthorized cron jobs
log "\n🔎 Checking cron jobs..."
ls -la /etc/cron* 2>/dev/null | tee -a "$LOGFILE"

# 🔹 Look for hidden files
log "\n🔎 Searching for hidden files..."
find / -name ".*" -type f 2>/dev/null | tee -a "$LOGFILE"

# 🔹 Check system logs for suspicious sudo access
log "\n🔎 Checking logs for unauthorized sudo access..."
sudo journalctl -xe --no-pager | grep -i "sudo" | tee -a "$LOGFILE"

# 🔹 Check /etc/shadow for weak permissions
log "\n🔎 Checking /etc/shadow permissions..."
ls -la /etc/shadow | tee -a "$LOGFILE"

# 🔹 Scan for rootkits (Requires rkhunter)
if command -v rkhunter &>/dev/null; then
    log "\n🔎 Running Rootkit Hunter scan..."
    sudo rkhunter --check --sk | tee -a "$LOGFILE"
else
    log "\n⚠️ Rootkit Hunter (rkhunter) not found! Install using: sudo apt install rkhunter"
fi

# 🔹 Check for passwordless users
log "\n🔎 Checking for users without passwords..."
awk -F: '($2 == "") {print $1 " has no password!"}' /etc/shadow | tee -a "$LOGFILE"

# 🔹 Set strict permissions on /etc/shadow
log "\n🔒 Hardening /etc/shadow permissions..."
chmod 640 /etc/shadow
ls -la /etc/shadow | tee -a "$LOGFILE"

# 🔹 Disable unused services (Example: telnet, rsh)
log "\n🔒 Disabling unused services..."
for service in telnet rsh rexec; do
    systemctl disable "$service" 2>/dev/null
    systemctl stop "$service" 2>/dev/null
done

log "\n✅ Security Audit Completed! Results saved in $LOGFILE"

📌 How to Use This Script

1️⃣ Copy and paste the script into a new file

nano security_audit.sh

2️⃣ Make it executable

chmod +x security_audit.sh

3️⃣ Run the script with sudo

sudo ./security_audit.sh

4️⃣ Review the log file

cat security_audit.log

🔒 Security Hardening Actions Taken

    ✅ Identifies SUID/SGID files
    ✅ Finds world-writable files and directories
    ✅ Checks sudo users and permissions
    ✅ Scans for open ports
    ✅ Identifies root-owned files in /home
    ✅ Scans cron jobs for unauthorized tasks
    ✅ Searches for hidden files
    ✅ Logs unauthorized sudo access attempts
    ✅ Audits /etc/shadow permissions
    ✅ Runs Rootkit Hunter (if installed)
    ✅ Identifies users without passwords
    ✅ Disables insecure services like telnet