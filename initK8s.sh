#!/bin/bash


side=$1

if [[ "$side" = "master" ]]
then

echo "you want to restart master \n"
#systemctl restart etcd flanneld docker  kube-apiserver kube-controller-manager.service kube-scheduler.service kubelet.service kube-proxy.service

else

echo "you want to restart node \n"
#systemctl restart flanneld docker  kubelet.service kube-proxy.service

fi

#master节点:
#hostnamectl set-hostname k8s-master
echo "finished to set hostname \n"