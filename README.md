```
curl -sfL https://get.k3s.io | sh -
```

Set up a tunnel to the VM:

```
ssh -L 6443:127.0.0.1:6443 $USER@$HOST
```

```
sudo cat /etc/rancher/k3s/k3s.yaml
```

```
export KUBECONFIG=$(pwd)/kubeconfig.secret
```

To check if the cluster is ready:

```
kubectl get nodes
```

```
kubectl create secret docker-registry registry-secret \
  --docker-server=europe-west4-docker.pkg.dev \
  --docker-username=_json_key \
  --docker-email=artifact-viewer@aleks-app.iam.gserviceaccount.com \
  --docker-password="$(cat key.secret.json)"
```

```
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.16.2 \
  --set crds.enabled=true
```

```
kubectl apply -f cluster/common/router.yaml
```

```
kubectl apply -f cluster/apps/frontend/deployment.yaml
```
