---
href: "/til/mtls_in_ruby"
title: mTLS in ruby
excerpt: mTLS in ruby ensures valid cert to access app. Config with key, cert, ca.
  Authenticate clients using certs for differentiation
date: '09/10/2025'
tags:
- mTLS
- Ruby
- Rails
- Authentication
- Certificate
published: true
updated: '09/10/2025'
topics: ruby
---

# mTLS in ruby

mTLS is mutual TLS and basically ensures that you have a valid certificate to be able to access the application

to implement this in ruby/rails you need to add to the puma config

```ruby

key_path = "./mtls/mtls.key"
cert_path = "./mtls/mtls.crt"
ca_path = "./mtls/ca.crt"

ssl_bind "0.0.0.0", "3001", {
  key: key_path,
  cert: cert_path,
  ca: ca_path,
  verify_mode: "force_peer"
}
```

this will validate the client certificates against these and make sure they were all signed by the same CA

if each client has it's own certificate you can use them to differentiate between clients and do authentication

```ruby
def authenticate_with_mtls
    client_cert_pem = request.env["puma.peercert"]

    unless client_cert_pem
        render json: { error: "Client certificate required." }, status: :unauthorized
        return
    end

    begin
        client_cert = OpenSSL::X509::Certificate.new(client_cert_pem)

        subject_cn = client_cert.subject.to_a.find { |name, _, _| name == "CN" }&.at(1)

        @current_user = User.find_by(certificate_common_name: subject_cn)

        if @current_user.nil?
            render json: { error: "Invalid client certificate." }, status: :unauthorized
            nil
        end

    rescue OpenSSL::X509::CertificateError => e
        render json: { error: "Certificate parsing error: #{e.message}" }, status: :bad_request
    end
end
```