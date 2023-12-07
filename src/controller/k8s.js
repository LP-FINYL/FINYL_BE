const k8s = require('@kubernetes/client-node');

// Kubernetes 클라이언트 구성
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Kubernetes API 클라이언트 생성
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// Namespace 및 Secret 이름 지정
const namespace = 'finyl'; // 원하는 네임스페이스로 변경
const secretName = 'finyl-backend-secret';

// Secret 가져오기
const readNamespacedSecret = async (secretName, namespace) => {
    try {
        const response = await k8sApi.readNamespacedSecret(secretName, namespace);

        // Secret 데이터는 response.body.data에 base64로 인코딩되어 있음
        const jsonData = Buffer.from(response.body.data['GoogleStorageKey.json'], 'base64').toString('utf-8');
        const parsedData = JSON.parse(jsonData);

        return parsedData;
    } catch (err) {
        console.error('Error:', err);
        throw err; // You can choose to handle the error or propagate it further
    }
};

module.exports = { readNamespacedSecret };



