"use client"

import { useEffect, useState } from "react"
import { initWeb3, getMessage, setMessage, divide, multiply, subtract, add } from "./utils/web3"

function App() {
  // Message state
  const [message, setMsg] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isMessageLoading, setIsMessageLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Calculator state
  const [num1, setNum1] = useState<number>(0)
  const [num2, setNum2] = useState<number>(0)
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string>("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [activeTab, setActiveTab] = useState("message")
  const [activeOperation, setActiveOperation] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMessage() {
      try {
        setIsMessageLoading(true)
        await initWeb3()
        const msg = await getMessage()
        setMsg(msg)
      } catch (err) {
        console.error("Failed to fetch message:", err)
      } finally {
        setIsMessageLoading(false)
      }
    }
    fetchMessage()
  }, [])

  const handleUpdateMessage = async () => {
    try {
      setIsUpdating(true)
      await setMessage(newMessage)
      setMsg(newMessage)
      setNewMessage("")
    } catch (err) {
      console.error("Failed to update message:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCalculation = async (operation: string) => {
    setIsCalculating(true)
    setError("")
    setActiveOperation(operation)

    try {
      let calculationResult

      switch (operation) {
        case "add":
          calculationResult = await add(num1, num2)
          break
        case "subtract":
          calculationResult = await subtract(num1, num2)
          break
        case "multiply":
          calculationResult = await multiply(num1, num2)
          break
        case "divide":
          if (num2 === 0) {
            throw new Error("Cannot divide by zero")
          }
          calculationResult = await divide(num1, num2)
          break
        default:
          throw new Error("Invalid operation")
      }

      setResult(Number(calculationResult))
    } catch (err) {
      setError(
        operation === "divide"
          ? "Error performing division. Cannot divide by zero."
          : operation === "subtract"
            ? "Error performing subtraction. First number must be greater than or equal to second number."
            : `Error performing ${operation}`,
      )
      console.error(err)
    } finally {
      setIsCalculating(false)
      setActiveOperation(null)
    }
  }

  return (
    <div className="app-wrapper">
      <div className="dapp-container">
        <header className="app-header">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="dapp-title">
              Web3 <span>Hello</span>
            </h1>
          </div>
          <p className="dapp-subtitle">Blockchain Interaction Made Simple</p>
        </header>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "message" ? "active" : ""}`}
              onClick={() => setActiveTab("message")}
            >
              <svg className="tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Message
            </button>
            <button
              className={`tab ${activeTab === "calculator" ? "active" : ""}`}
              onClick={() => setActiveTab("calculator")}
            >
              <svg className="tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 7V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V7C20 4.79086 18.2091 3 16 3H8C5.79086 3 4 4.79086 4 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 9L12 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Calculator
            </button>
          </div>
        </div>

        <div className="content-wrapper">
          {activeTab === "message" && (
            <div className="tab-content">
              <div className="card message-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Blockchain Message
                  </h2>
                  <p className="card-description">View and update the message stored on the blockchain</p>
                </div>

                <div className="message-display">
                  <div className="display-header">
                    <h3 className="section-label">
                      <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 12H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 6H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 18H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Current Message
                    </h3>
                    <div className="blockchain-badge">On Chain</div>
                  </div>

                  {isMessageLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <div className="message-content">
                      <p className="message-text">{message || "No message set"}</p>
                    </div>
                  )}
                </div>

                <div className="message-update">
                  <h3 className="section-label">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Update Message
                  </h3>
                  <div className="input-group">
                    <div className="input-with-icon">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        className="input-field"
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Enter new message"
                      />
                    </div>
                    <button
                      className={`update-button ${isUpdating ? "loading" : ""}`}
                      onClick={handleUpdateMessage}
                      disabled={isUpdating || !newMessage.trim()}
                    >
                      {isUpdating ? (
                        <>
                          <span className="button-text">Updating</span>
                          <span className="dot-loader">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="button-text">Update Message</span>
                          <svg
                            className="button-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 12H19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 5L19 12L12 19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "calculator" && (
            <div className="tab-content">
              <div className="card calculator-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 7V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V7C20 4.79086 18.2091 3 16 3H8C5.79086 3 4 4.79086 4 7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 12H15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 9L12 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Blockchain Calculator
                  </h2>
                  <p className="card-description">Perform calculations using smart contracts</p>
                </div>

                <div className="calculator-inputs">
                  <div className="input-wrapper">
                    <label htmlFor="num1" className="input-label">
                      <svg className="label-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2V4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20V22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.93 4.93L6.34 6.34"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.66 17.66L19.07 19.07"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12H4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 12H22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.34 17.66L4.93 19.07"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.07 4.93L17.66 6.34"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      First Number
                    </label>
                    <div className="input-with-icon">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 8.00002L20 12L16 16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 12H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        id="num1"
                        className="input-field"
                        type="number"
                        value={num1}
                        onChange={(e) => setNum1(Number(e.target.value))}
                        aria-label="First number input"
                      />
                    </div>
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="num2" className="input-label">
                      <svg className="label-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2V4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20V22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.93 4.93L6.34 6.34"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.66 17.66L19.07 19.07"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12H4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 12H22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.34 17.66L4.93 19.07"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.07 4.93L17.66 6.34"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Second Number
                    </label>
                    <div className="input-with-icon">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 8.00002L20 12L16 16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 12H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        id="num2"
                        className="input-field"
                        type="number"
                        value={num2}
                        onChange={(e) => setNum2(Number(e.target.value))}
                        aria-label="Second number input"
                      />
                    </div>
                  </div>
                </div>

                <div className="calculator-operations">
                  <h3 className="section-label">
                    <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 5L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Operations
                  </h3>
                  <div className="calculator-buttons">
                    <button
                      className={`calc-button ${activeOperation === "add" ? "calculating" : ""}`}
                      onClick={() => handleCalculation("add")}
                      disabled={isCalculating}
                    >
                      <svg className="calc-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 5V19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Add
                    </button>
                    <button
                      className={`calc-button ${activeOperation === "subtract" ? "calculating" : ""}`}
                      onClick={() => handleCalculation("subtract")}
                      disabled={isCalculating}
                    >
                      <svg className="calc-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Subtract
                    </button>
                    <button
                      className={`calc-button ${activeOperation === "multiply" ? "calculating" : ""}`}
                      onClick={() => handleCalculation("multiply")}
                      disabled={isCalculating}
                    >
                      <svg className="calc-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6 18L18 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Multiply
                    </button>
                    <button
                      className={`calc-button ${activeOperation === "divide" ? "calculating" : ""}`}
                      onClick={() => handleCalculation("divide")}
                      disabled={isCalculating}
                    >
                      <svg className="calc-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 19L12 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Divide
                    </button>
                  </div>
                </div>

                {isCalculating && (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p className="loading-text">Calculating on blockchain...</p>
                  </div>
                )}

                {result !== null && !error && (
                  <div className="result-container">
                    <div className="result-header">
                      <h3 className="result-label">
                        <svg className="result-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 4L12 14.01L9 11.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Result
                      </h3>
                      <div className="blockchain-badge">Verified</div>
                    </div>
                    <p className="result-text">{result}</p>
                  </div>
                )}

                {error && (
                  <div className="error-container">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8V12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16H12.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="error-text">Error: {error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="dapp-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer-logo-icon">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Web3 Hello</span>
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">
                Documentation
              </a>
              <a href="#" className="footer-link">
                GitHub
              </a>
              <a href="#" className="footer-link">
                Support
              </a>
            </div>
          </div>
          <div className="footer-divider"></div>
          <p className="copyright">© {new Date().getFullYear()} Web3 Hello World App • All Rights Reserved</p>
        </footer>
      </div>
    </div>
  )
}

export default App

