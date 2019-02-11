#!/bin/bash


side=$1
hostIP=$1

if [ ! -n "$hostIP" ]
then

echo "you have no a host ip to create master \n"
echo 127.0.0.1 k8s-master >> /etc/hosts
else

echo "you have a host ip to create master \n"
echo $hostIP k8s-master >> /etc/hosts

fi

#master节点:
hostnamectl set-hostname k8s-master
echo "finished to set hostname \n"

#echo $hostIP k8s-master >> /etc/hosts

#关闭防火墙和selinux
systemctl stop firewalld && systemctl disable firewalld
sed -i 's/^SELINUX=enforcing$/SELINUX=disabled/' /etc/selinux/config && setenforce 0

#关闭swap
swapoff -a
#yes | cp /etc/fstab /etc/fstab_bak
#cat /etc/fstab_bak |grep -v swap > /etc/fstab

#安装chrony：
yum install -y chrony
#注释默认ntp服务器
sed -i 's/^server/#&/' /etc/chrony.conf
#指定上游公共 ntp 服务器，并允许其他节点同步时间
echo server 0.asia.pool.ntp.org iburst >> /etc/chrony.conf
echo server 1.asia.pool.ntp.org iburst >> /etc/chrony.conf
echo server 2.asia.pool.ntp.org iburst >> /etc/chrony.conf
echo allow all >> /etc/chrony.conf
#重启chronyd服务并设为开机启动：
systemctl enable chronyd && systemctl restart chronyd
#开启网络时间同步功能
timedatectl set-ntp true

#安装chrony：
#yum install -y chrony
#注释默认服务器
#sed -i 's/^server/#&/' /etc/chrony.conf
#指定内网 master节点为上游NTP服务器
#echo server k8s-master iburst >> /etc/chrony.conf
#重启服务并设为开机启动：
#systemctl enable chronyd && systemctl restart chronyd


#配置docker yum源
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

#安装指定版本，这里安装18.06
yum list docker-ce --showduplicates | sort -r
yum install -y docker-ce-18.06.1.ce-3.el7
systemctl start docker && systemctl enable docker

#创建k8s的基于阿里的yum源
touch /etc/yum.repos.d/kubernetes.repo
echo [kubernetes] >> /etc/yum.repos.d/kubernetes.repo
echo name=Kubernetes >> /etc/yum.repos.d/kubernetes.repo
echo baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/ >> /etc/yum.repos.d/kubernetes.repo
echo enabled=1 >> /etc/yum.repos.d/kubernetes.repo
echo gpgcheck=1 >> /etc/yum.repos.d/kubernetes.repo
echo repo_gpgcheck=1 >> /etc/yum.repos.d/kubernetes.repo
echo gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg >> /etc/yum.repos.d/kubernetes.repo


#在所有节点上安装指定版本kubeadm
yum install -y kubeadm-1.13.1

kubeadm reset --force
kubeadm init --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.13.1 --pod-network-cidr=10.244.0.0/16
#启动kubelet服务
systemctl enable kubelet && systemctl start kubelet

#创建启动配置到当前用户下。
mkdir -p $HOME/.kube
cp -rf /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config

#安装虚拟网络组件到K8s
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
echo "finished to create flannel network component \n"

kubectl taint node k8s-master node-role.kubernetes.io/master-
echo "finished to make k8s master as node \n"

#安装ingress-nginx处理网络接入
#kubectl apply -f ./cloud-resources/k8s/resources/deployments/ingress-nginx.yaml

#安装mysql
#kubectl apply -f ./cloud-resources/k8s/resources/deployments/mysql.yaml
#安装Redis
#kubectl apply -f ./cloud-resources/k8s/resources/deployments/redis.yaml
#echo "finished to create some common services \n"

#创建TLS证书
#mkdir -p ./certs 
#openssl genrsa -des3 -passout pass:x -out certs/dashboard.pass.key 2048
#openssl rsa -passin pass:x -in certs/dashboard.pass.key -out certs/dashboard.key
#openssl req -new -key certs/dashboard.key -out certs/dashboard.csr -subj '/CN=kube-TLS'
#openssl x509 -req -sha256 -days 365 -in certs/dashboard.csr -signkey certs/dashboard.key -out certs/dashboard.crt
#kubectl create secret generic default-certs --from-file=certs -n ingress-nginx
#rm -rf ./certs
#echo "finished to create default ingress TLS Certs \n"

#create node join token string
kubeadm token create --print-join-command


#安装Xci自身项目到K8s中去


#安装图形化管理界面Dashboard