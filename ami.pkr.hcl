packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "aws_profile" {
  type    = string
  default = "git"
}
variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9" 
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0063f324cf391fc6e"
}

variable "ami_regions" {
  type    = list(string)
  default = ["us-east-1"]
}

variable "ami_users" {
  type    = list(string)
  default = ["892166389258"]
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for nodejs app"
  ami_regions     = "${var.ami_regions}"
  ami_users       = "${var.ami_users}"
  profile         = "${var.aws_profile}"

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "${var.instance_type}"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]
  provisioner "shell" {
    inline = [
      "sudo apt update",
      "sudo apt install -y nodejs npm",
      "sudo groupadd csye6225",
      "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
      "mkdir -p ~/webapp/dist",
    ]
  }
  provisioner "file" {
    source      = fileexists("dist/main.js") ? "dist/main.js" : "/"
    destination = "/home/admin/webapp/dist/main.js"
  }
  provisioner "file" {
    source      = "package.json"
    destination = "/home/admin/webapp/package.json"
  }
  provisioner "file" {
    source      = fileexists("Users.csv") ? "Users.csv" : "/"
    destination = "/home/admin/webapp/Users.csv"
  }
  provisioner "file" {
    source      = fileexists(".env") ? ".env" : "/"
    destination = "/home/admin/webapp/.env"
  }
  provisioner "file" {
    source      = "webapp.service"
    destination = "/home/admin/webapp/webapp.service"
  }
  provisioner "shell" {
    inline = [
      "cd /home/admin/webapp && npm install",
      "sudo mv ~/webapp/Users.csv /opt/",
      "sudo mv ~/webapp/webapp.service /etc/systemd/system/",
      "sudo mv ~/webapp /opt/csye6225/",
      "sudo chown -R csye6225:csye6225 /opt/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp",
      "sudo systemctl start webapp"
    ]
  }
}
