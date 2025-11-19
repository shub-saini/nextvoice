terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "eu-north-1"
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "app_sg" {
  name        = "app-sg"
  description = "Allow app traffic + exporters"
  vpc_id = data.aws_vpc.default.id

  ingress {
    description = "HTTP for app"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Node exporter"
    from_port   = 9100
    to_port     = 9100
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Process exporter"
    from_port   = 9256
    to_port     = 9256
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
  description = "cAdvisor"
  from_port   = 8080
  to_port     = 8080
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "monitor_sg" {
  name        = "monitoring-sg"
  description = "Allow access to Prometheus/Grafana"
  vpc_id = data.aws_vpc.default.id

  ingress {
    description = "Grafana (3000)"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Prometheus (9090)"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_instance" "app1" {
  ami           = "ami-0fa91bc90632c73c9" 
  instance_type = "t3.medium"
  key_name      = "stolkholm-endeavour"

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "app-1"
  }
}


resource "aws_instance" "app2" {
  ami           = "ami-0fa91bc90632c73c9"
  instance_type = "t3.medium"
  key_name      = "stolkholm-endeavour"

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "app-2"
  }
}

resource "aws_instance" "monitor" {
  ami           = "ami-0fa91bc90632c73c9"
  instance_type = "t3.small"
  key_name      = "stolkholm-endeavour"

  vpc_security_group_ids = [aws_security_group.monitor_sg.id]

  tags = {
    Name = "monitoring"
  }
}

output "app1_server_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app1.public_ip
}

output "app2_server_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app2.public_ip
}

output "monitoring_server_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.monitor.public_ip
}
