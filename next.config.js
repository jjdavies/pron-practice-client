module.exports = {
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/option/:path*',
        destination: 'http://localhost:3000/option/:path*',
      },
      {
        source: '/activity/:path*',
        destination: 'http://localhost:3000/activity/:path*',
      },
      {
        source: '/file/:path*',
        destination: 'http://localhost:3000/file/:path*',
      },
      {
        source: '/user/:path*',
        destination: 'http://localhost:3000/user/:path*',
      },
      {
        source: '/session/:path*',
        destination: 'http://localhost:3000/session/:path*',
      },
    ];
  },
};
