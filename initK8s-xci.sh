#!/bin/bash



webDN=$1
if [ -n "$webDN" ]
then
echo "you have input param $webDN \n"
else
echo "you have input param"
webDN=release.zhangyongqiao.com
fi

#创建TLS证书
mkdir -p ./certs 
openssl genrsa -des3 -passout pass:x -out certs/dashboard.pass.key 2048
openssl rsa -passin pass:x -in certs/dashboard.pass.key -out certs/dashboard.key
openssl req -new -key certs/dashboard.key -out certs/dashboard.csr -subj '/CN=kube-TLS'
openssl x509 -req -sha256 -days 365 -in certs/dashboard.csr -signkey certs/dashboard.key -out certs/dashboard.crt
kubectl create secret generic default-certs --from-file=certs -n ingress-nginx
rm -rf ./certs
echo "finished to create default ingress TLS Certs \n"

#安装ingress-nginx处理网络接入
kubectl apply -f ./cloud-resources/k8s/resources/deployments/ingress-nginx.yaml

#安装mysql
kubectl apply -f ./cloud-resources/k8s/resources/deployments/mysql.yaml
#安装Redis
kubectl apply -f ./cloud-resources/k8s/resources/deployments/redis.yaml
echo "finished to create some common services \n"


#安装虚拟网络组件到K8s
docker build . -t xci-web

rm -rf final-deployment.yaml
sed -e "s/release.zhangyongqiao.com/$webDN/g" < ./deployment.yaml > final-deployment.yaml
kubectl apply -f ./final-deployment.yaml
rm -rf final-deployment.yaml



