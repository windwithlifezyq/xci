kubeadm reset \
    --apiserver-advertise-address=172.16.140.118 \
    --image-repository registry.aliyuncs.com/google_containers \
    --kubernetes-version v1.13.1 \
    --pod-network-cidr=10.244.0.0/16
http://<master-ip>:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/


[centos@k8s-master ~]$ vim kubernetes-dashboard.yaml 
......
---
# ------------------- Dashboard Deployment ------------------- #

kind: Deployment
apiVersion: apps/v1beta2
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: kubernetes-dashboard
  template:
    metadata:
      labels:
        k8s-app: kubernetes-dashboard
    spec:
      containers:
      - name: kubernetes-dashboard
       
        image: registry.cn-hangzhou.aliyuncs.com/google_containers/kubernetes-dashboard-amd64:v1.10.1
        ports:
        - containerPort: 8443
          protocol: TCP
        args:
          - --tls-key-file=dashboard.key
          - --tls-cert-file=dashboard.crt
         
        volumeMounts:

---


kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  ports:
    - port: 443
      targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard





# 生成client-certificate-data
grep 'client-certificate-data' ~/.kube/config | head -n 1 | awk '{print $2}' | base64 -d >> kubecfg.crt
# 生成client-key-data
grep 'client-key-data' ~/.kube/config | head -n 1 | awk '{print $2}' | base64 -d >> kubecfg.key
# 生成p12
openssl pkcs12 -export -clcerts -inkey kubecfg.key -in kubecfg.crt -out kubecfg.p12 -name "kubernetes-client"
[centos@k8s-master ~]$ ll
-rw-rw-r--  1 centos centos     1082 Dec 28 19:41 kubecfg.crt
-rw-rw-r--  1 centos centos     1675 Dec 28 19:41 kubecfg.key
-rw-rw-r--  1 centos centos     2464 Dec 28 19:41 kubecfg.p12



apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kube-system
--------------------- 
作者：willblog 
来源：CSDN 
原文：https://blog.csdn.net/networken/article/details/85607593 
版权声明：本文为博主原创文章，转载请附上博文链接！

[centos@k8s-master 
Name:         admin-user-token-jtlbp
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: a345b4d5-1006-11e9-b90d-000c291c25f3

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWp0bGJwIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJhMzQ1YjRkNS0xMDA2LTExZTktYjkwZC0wMDBjMjkxYzI1ZjMiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.uv3pzkM3_WQ8_gOwzEvKGrwfhXKtQmDYtfMpjmCDsPsq7OP3W5o0uFxKS7q2zbxw_pFZ3pFMyEk462RZo5z-Z6AB9gOXffvhqllSIQi3SzesvRcBqqW1n48SalGgBkCiqkX4DjjYDrHCAd5m-Uc7e3N28jWW5O4gUXEWwUtcobLVflEOnZ9Ykx9JBZPkmmS25toyoE6v8W7Zuv1moGBxmx4_AEnAFBUNDjZ7AxvmERQL-cQk6vsfrQ-hPejE1L3kgLbhpQnqQ3lJ3z7hrGMur31muW3WeOvd3Aciqr0TliyP1Wllf-hPuLPDsLdNZJpMx1B8O5jnw1cYbLsqQAaUXQ
[centos@k8s-master ~]$ 

$ wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
$ kubectl apply -f mandatory.yaml

$ mkdir -p /usr/local/src/kubernetes/certs
$ cd /usr/local/src/kubernetes
$ openssl genrsa -des3 -passout pass:x -out certs/dashboard.pass.key 2048
$ openssl rsa -passin pass:x -in certs/dashboard.pass.key -out certs/dashboard.key
$ openssl req -new -key certs/dashboard.key -out certs/dashboard.csr -subj '/CN=kube-dashboard'
$ openssl x509 -req -sha256 -days 365 -in certs/dashboard.csr -signkey certs/dashboard.key -out certs/dashboard.crt
$ rm certs/dashboard.pass.key
$ kubectl create secret generic kubernetes-dashboard-certs --from-file=certs -n kube-system


[centos@k8s-master ~]$ vim kubernetes-dashboard-ingress.yaml 
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  rules:
  - host: dashboard.host.com
    http:
      paths:
      - path: /
        backend:
          servicePort: 443
          serviceName: kubernetes-dashboard
  tls:
  - hosts:
    - dashboard.host.com
    secretName: kubernetes-dashboard-certs-ingress



