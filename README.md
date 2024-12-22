I love Google Cloud Run but don't want to overpay for it.

This is an attempt to create a performant and cloud agnostic K3s cluster that is stupid simple to set up and manage.

## When setting up on a new VM

1. Install K3s (a Kubernetes distribution)

```
curl -sfL https://get.k3s.io | sh -
```

2. Create a tunnel to the VM, leave this terminal open. As long as it's open, you can use `kubectl` on the host to manage the cluster.

```
ssh -L 6443:127.0.0.1:6443 $USER@$HOST
```

3. Get the kubeconfig

```
sudo cat /etc/rancher/k3s/k3s.yaml
```

Save the output to `kubeconfig.secret` on the host.

4. Export the kubeconfig so `kubectl` can use it

```
export KUBECONFIG=$(pwd)/kubeconfig.secret
```

5. Check if the cluster is ready:

```
kubectl get nodes
```

6. Create a secret for the Docker registry on Google Cloud

```
kubectl create secret docker-registry registry-access-<REGION> \
  --docker-server=<REGION>-docker.pkg.dev \
  --docker-username=_json_key \
  --docker-email=artifact-viewer@aleks-app.iam.gserviceaccount.com \
  --docker-password="$(cat key.secret.json)"
```

With `<REGION>` being e. g. `europe-west3` `europe-west4` and so on.

7. Install cert-manager

```
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.16.2 \
  --set crds.enabled=true
```

8. Create the necessary secrets

```
npm install
node scripts/update-secrets.js
```

9. Install the apps

```
helm install aleks-backend cluster/apps/aleks-backend
helm install aleks-web cluster/apps/aleks-web
helm install aleks-web-staging cluster/apps/aleks-web-staging
```

9. Install the router

```
kubectl apply -f cluster/common/router.yaml
```
