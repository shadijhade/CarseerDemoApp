FROM alpine:latest

# Install dependencies required by .NET self-contained applications on Alpine
RUN apk add --no-cache libstdc++ zlib icu-libs

WORKDIR /app

# Copy the globally published artifact which already includes /wwwroot mapped frontend
COPY src/backend/bin/Release/net10.0/linux-musl-x64/publish .

EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

ENTRYPOINT ["./CarseerShadiDemo.Api"]
